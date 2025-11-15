import { Actor, Dataset, log } from 'apify';
import { chromium } from 'playwright';

type JsonRecord = Record<string, unknown>;

type Maybe<T> = T | null | undefined;

type CopartSearchCriteria = {
    query?: unknown;
    filter?: unknown;
    sort?: unknown;
    freeFormSearch?: unknown;
    watchListOnly?: unknown;
    searchName?: unknown;
};

interface CopartSearchContext {
    type: 'search';
    origin: string;
    originalUrl: URL;
    searchCriteriaRaw?: string | null;
    searchCriteria?: CopartSearchCriteria;
    searchTerm?: string | null;
    pageSize?: number | null;
}

interface CopartLotContext {
    type: 'lot';
    origin: string;
    originalUrl: URL;
    lotNumber: string;
    slug?: string | null;
}

type CopartStartContext = CopartSearchContext | CopartLotContext;

interface CopartScraperOptions {
    startUrl: string;
    maxItems?: number;
}

interface CopartSearchResultPage {
    lots: JsonRecord[];
    totalElements: number | null;
}

interface EnrichedLotData {
    lotNumber: string;
    baseLot: JsonRecord | null;
    lotDetails: unknown;
    dynamicLot: unknown;
    damageDetails: unknown;
    buildSheet: unknown;
    origin: string;
    slug?: string | null;
}

const DEFAULT_PAGE_SIZE = 100;
const MIN_PAGE_SIZE = 1;
const MAX_PAGE_SIZE = 500;

const COPART_DEFAULT_HEADERS = {
    'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    Accept: 'application/json, text/plain, */*',
    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
    'X-Requested-With': 'XMLHttpRequest',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Dest': 'empty',
};

const COPART_BOOTSTRAP_PATHS = ['/', '/vehicleFinder', '/search/'];

const SESSION_COOKIES = new Map<string, string>();

const NUMBER_SANITIZE_REGEX = /[^0-9.,-]/g;
const LOT_NUMBER_REGEX = /(\d{5,})/;

export async function runCopartScraper(options: CopartScraperOptions): Promise<number> {
    const context = parseStartUrl(options.startUrl);
    const maxItems = sanitizeMaxItems(options.maxItems);

    if (context.type === 'lot') {
        const enriched = await fetchSingleLot(context);
        if (!enriched) {
            log.warning(`[Copart] Não foi possível localizar o lote ${context.lotNumber}.`);
            return 0;
        }

        const item = buildDatasetItem(enriched);
        await Actor.pushData(item);
        return 1;
    }

    let processed = 0;
    const pageSize = sanitizePageSize(context.pageSize ?? null) ?? DEFAULT_PAGE_SIZE;

    for await (const lot of iterateSearchResults(context, pageSize, maxItems)) {
        const lotNumber = pickLotNumber(lot);
        if (!lotNumber) {
            log.warning('[Copart] Lote sem identificador encontrado, ignorando.');
            continue;
        }

        const enriched = await fetchLotEnhancements({
            lotNumber,
            baseLot: lot,
            lotDetails: null,
            dynamicLot: null,
            damageDetails: null,
            buildSheet: null,
            origin: context.origin,
        });

        const datasetItem = buildDatasetItem(enriched);
        await Actor.pushData(datasetItem);
        processed += 1;

        if (typeof maxItems === 'number' && processed >= maxItems) {
            break;
        }
    }

    return processed;
}

function parseStartUrl(startUrl: string): CopartStartContext {
    const url = new URL(startUrl);
    const { origin } = url;

    const lotMatch = url.pathname.match(/\/lot\/([^/]+)/i);
    if (lotMatch) {
        const [, lotSlug] = lotMatch;
        const lotNumberMatch = lotSlug.match(LOT_NUMBER_REGEX);
        const lotNumber = lotNumberMatch ? lotNumberMatch[1] : lotSlug;

        return {
            type: 'lot',
            origin,
            originalUrl: url,
            lotNumber,
            slug: lotSlug,
        };
    }

    const searchCriteriaRaw = url.searchParams.get('searchCriteria');
    const searchCriteria = tryParseSearchCriteria(searchCriteriaRaw);
    const searchTerm = deriveSearchTerm(url);
    const pageSizeParam = sanitizePageSize(parsePositiveInteger(url.searchParams.get('size')) ?? null);

    return {
        type: 'search',
        origin,
        originalUrl: url,
        searchCriteriaRaw,
        searchCriteria,
        searchTerm,
        pageSize: pageSizeParam,
    };
}

async function* iterateSearchResults(
    context: CopartSearchContext,
    pageSize: number,
    maxItems?: number,
): AsyncGenerator<JsonRecord> {
    let page = 0;
    let emitted = 0;
    let totalElements: number | null = null;

    while (true) {
        const result = await fetchSearchPage(context, page, pageSize);
        if (totalElements === null && typeof result.totalElements === 'number') {
            totalElements = result.totalElements;
        }

        if (result.lots.length === 0) {
            break;
        }

        for (const lot of result.lots) {
            yield lot;
            emitted += 1;

            if (typeof maxItems === 'number' && emitted >= maxItems) {
                return;
            }
        }

        if (result.lots.length < pageSize) {
            break;
        }

        if (typeof totalElements === 'number' && emitted >= totalElements) {
            break;
        }

        page += 1;
    }
}

async function fetchSearchPage(context: CopartSearchContext, page: number, pageSize: number): Promise<CopartSearchResultPage> {
    const url = new URL('/public/data/lots/search', context.origin);

    const payload = buildSearchPayload(context, page, pageSize);

    try {
        const response = await copartFetchJson(url, {
            method: 'POST',
            origin: context.origin,
            body: payload,
        });
        return extractSearchResult(response);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        log.warning(`[Copart] Falha na chamada principal da busca (${message}). Tentando fallback GET.`);

        const fallbackUrl = new URL('/public/data/lots/search-results', context.origin);
        for (const [key, value] of context.originalUrl.searchParams.entries()) {
            fallbackUrl.searchParams.set(key, value);
        }

        fallbackUrl.searchParams.set('page', String(page));
        fallbackUrl.searchParams.set('size', String(pageSize));

        const term = context.searchTerm?.trim();
        if (term && !fallbackUrl.searchParams.has('query')) {
            fallbackUrl.searchParams.set('query', term);
        }
        if (term && !fallbackUrl.searchParams.has('freeFormSearch')) {
            fallbackUrl.searchParams.set('freeFormSearch', term);
        }

        const fallbackResponse = await copartFetchJson(fallbackUrl, {
            method: 'GET',
            origin: context.origin,
        });

        return extractSearchResult(fallbackResponse);
    }
}

function buildSearchPayload(context: CopartSearchContext, page: number, pageSize: number): JsonRecord {
    const searchTerm = context.searchTerm?.trim();
    const payload: JsonRecord = {
        page,
        size: pageSize,
        query: '*',
        freeFormSearch: searchTerm ?? '',
        sort: [
            { field: 'auctionDate', direction: 'ASC' },
            { field: 'lotNumber', direction: 'ASC' },
        ],
        filters: [],
        watchListOnly: false,
    };

    if (searchTerm && searchTerm.length > 0) {
        payload.query = Array.isArray(context.searchCriteria?.query)
            ? context.searchCriteria?.query
            : [searchTerm];
        payload.freeFormSearch = searchTerm;
    } else if (Array.isArray(context.searchCriteria?.query)) {
        payload.query = context.searchCriteria?.query;
    }

    if (context.searchCriteria?.filter) {
        payload.filters = context.searchCriteria.filter as JsonRecord;
    }

    if (context.searchCriteria?.sort) {
        payload.sort = context.searchCriteria.sort as JsonRecord;
    }

    if (typeof context.searchCriteria?.watchListOnly === 'boolean') {
        payload.watchListOnly = context.searchCriteria.watchListOnly as boolean;
    }

    if (typeof context.searchCriteria?.searchName === 'string') {
        payload.searchName = context.searchCriteria.searchName as string;
    }

    if (context.searchCriteriaRaw) {
        payload.searchCriteria = context.searchCriteriaRaw;
    }

    return payload;
}

function extractSearchResult(response: unknown): CopartSearchResultPage {
    const containers: Maybe<JsonRecord>[] = [];

    if (isRecord(response)) {
        containers.push(response);
        if (isRecord(response.data)) {
            containers.push(response.data);
            if (isRecord(response.data.results)) {
                containers.push(response.data.results);
            }
        }
        if (isRecord(response.results)) {
            containers.push(response.results);
        }
    }

    const lots: JsonRecord[] = [];
    let total: number | null = null;

    for (const container of containers) {
        if (!container) continue;

        if (Array.isArray(container.content)) {
            for (const item of container.content) {
                if (isRecord(item)) {
                    lots.push(item);
                }
            }
        }

        if (typeof container.totalElements === 'number' && Number.isFinite(container.totalElements)) {
            total = container.totalElements;
        }
    }

    return {
        lots,
        totalElements: total,
    };
}

async function fetchSingleLot(context: CopartLotContext): Promise<EnrichedLotData | null> {
    const searchContext: CopartSearchContext = {
        type: 'search',
        origin: context.origin,
        originalUrl: context.originalUrl,
        searchTerm: context.lotNumber,
        searchCriteriaRaw: undefined,
        searchCriteria: undefined,
        pageSize: 1,
    };

    let baseLot: JsonRecord | null = null;
    try {
        const result = await fetchSearchPage(searchContext, 0, 1);
        baseLot = result.lots.find((lot) => {
            const lotNumber = pickLotNumber(lot);
            return lotNumber === context.lotNumber;
        }) ?? result.lots[0] ?? null;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        log.warning(`[Copart] Falha ao localizar informações iniciais do lote ${context.lotNumber}: ${message}`);
    }

    const enriched = await fetchLotEnhancements({
        lotNumber: context.lotNumber,
        baseLot,
        lotDetails: null,
        dynamicLot: null,
        damageDetails: null,
        buildSheet: null,
        origin: context.origin,
        slug: context.slug ?? undefined,
    });

    return enriched;
}

async function fetchLotEnhancements(initial: EnrichedLotData): Promise<EnrichedLotData> {
    const { lotNumber, origin } = initial;

    const [lotDetails, dynamicLot, damageDetails, buildSheet] = await Promise.all([
        fetchFirstSuccessful(origin, [`/public/data/lotdetails/solr/${lotNumber}`, `/public/data/lotdetails/search-results/${lotNumber}`], 'detalhes do lote'),
        fetchFirstSuccessful(origin, [`/public/data/lotdetails/dynamic/${lotNumber}`], 'dados dinâmicos'),
        fetchFirstSuccessful(origin, [
            `/public/data/lotdetails/damage/${lotNumber}`,
            `/public/data/lotdetails/damages/${lotNumber}`,
            `/public/data/v1/lotdetails/damage/${lotNumber}`,
        ], 'relatório de danos'),
        fetchFirstSuccessful(origin, [
            `/public/data/lotdetails/buildsheet/${lotNumber}`,
            `/public/data/v1/lotdetails/buildsheet/${lotNumber}`,
            `/public/data/v2/lotdetails/buildsheet/${lotNumber}`,
        ], 'build sheet'),
    ]);

    return {
        ...initial,
        lotDetails: lotDetails ?? initial.lotDetails,
        dynamicLot: dynamicLot ?? initial.dynamicLot,
        damageDetails: damageDetails ?? initial.damageDetails,
        buildSheet: buildSheet ?? initial.buildSheet,
    };
}

class CopartFetchError extends Error {
    constructor(message: string, public status?: number) {
        super(message);
        this.name = 'CopartFetchError';
    }
}

async function fetchFirstSuccessful(origin: string, endpoints: string[], description: string): Promise<unknown> {
    for (const endpoint of endpoints) {
        try {
            const data = await copartFetchJson(new URL(endpoint, origin), {
                method: 'GET',
                origin,
                allowError: true,
            });
            if (data) {
                return data;
            }
        } catch (error) {
            const status = error instanceof CopartFetchError ? error.status : undefined;
            if (status && (status === 404 || status === 403)) {
                continue;
            }
            const message = error instanceof Error ? error.message : String(error);
            log.debug(`[Copart] Falha ao obter ${description} (${endpoint}): ${message}`);
        }
    }

    return null;
}

async function prepareCopartSessionWithPlaywright(origin: string): Promise<void> {
    log.info('[Copart] Iniciando navegador Playwright para bypass do Incapsula...');
    
    const browser = await chromium.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-blink-features=AutomationControlled',
        ],
    });

    try {
        const context = await browser.newContext({
            userAgent: COPART_DEFAULT_HEADERS['User-Agent'],
            locale: 'pt-BR',
            viewport: { width: 1920, height: 1080 },
        });

        const page = await context.newPage();

        // Navega para uma das páginas de bootstrap
        const targetUrl = new URL(COPART_BOOTSTRAP_PATHS[0], origin);
        log.info(`[Copart] Navegando para ${targetUrl.toString()} com Playwright...`);
        
        await page.goto(targetUrl.toString(), {
            waitUntil: 'networkidle',
            timeout: 60000,
        });

        // Aguarda um pouco para garantir que scripts Incapsula executaram
        await page.waitForTimeout(3000);

        // Extrai cookies do navegador
        const cookies = await context.cookies();
        
        if (cookies.length > 0) {
            const cookieStrings = cookies.map(
                (cookie) => `${cookie.name}=${cookie.value}`
            );
            const merged = cookieStrings.join('; ');
            SESSION_COOKIES.set(origin, merged);
            log.info(`[Copart] Sessão inicializada com Playwright: ${cookies.length} cookie(s) obtido(s)`);
        } else {
            log.warning('[Copart] Nenhum cookie obtido via Playwright');
        }

        await context.close();
    } finally {
        await browser.close();
    }
}

async function prepareCopartSession(origin: string, forceRefresh = false): Promise<string | null> {
    if (forceRefresh) {
        invalidateSession(origin);
    }

    const existing = SESSION_COOKIES.get(origin);
    if (existing) {
        return existing;
    }

    for (const path of COPART_BOOTSTRAP_PATHS) {
        const bootstrapUrl = new URL(path, origin);
        try {
            const headers: Record<string, string> = {
                ...COPART_DEFAULT_HEADERS,
                Accept:
                    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-Dest': 'document',
            };

            const response = await fetch(bootstrapUrl, {
                method: 'GET',
                headers,
            });

            updateSessionCookies(origin, response.headers);

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.toLowerCase().includes('text/html')) {
                const body = await response.text().catch(() => null);
                if (body) {
                    await attemptIncapsulaBootstrap(body, origin, bootstrapUrl);
                }
            }

            const stored = SESSION_COOKIES.get(origin);
            if (stored) {
                return stored;
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            log.debug(`[Copart] Falha ao inicializar sessão (${bootstrapUrl.toString()}): ${message}`);
        }
    }

    // Se não conseguiu cookies via fetch, tenta com Playwright
    log.info('[Copart] Tentando inicializar sessão com Playwright...');
    try {
        await prepareCopartSessionWithPlaywright(origin);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        log.warning(`[Copart] Falha ao inicializar sessão com Playwright: ${message}`);
    }

    return SESSION_COOKIES.get(origin) ?? null;
}

function updateSessionCookies(origin: string, headers: Headers): void {
    const setCookies = extractSetCookies(headers);
    if (setCookies.length === 0) {
        return;
    }

    const merged = mergeCookies(SESSION_COOKIES.get(origin) ?? null, setCookies);
    if (merged) {
        SESSION_COOKIES.set(origin, merged);
    }
}

async function attemptIncapsulaBootstrap(html: string, origin: string, baseUrl: URL): Promise<void> {
    const inlineCookies = extractDocumentCookieStatements(html);
    if (inlineCookies.length > 0) {
        applyDocumentCookieStatements(origin, inlineCookies);
        if (SESSION_COOKIES.has(origin)) {
            return;
        }
    }

    const resourcePaths = new Set<string>();
    const resourceRegex = /<script[^>]+src=["']([^"']+_Incapsula_Resource[^"']*)["']/gi;

    for (const match of html.matchAll(resourceRegex)) {
        if (match[1]) {
            resourcePaths.add(match[1]);
        }
    }

    for (const path of resourcePaths) {
        if (SESSION_COOKIES.has(origin)) {
            return;
        }

        try {
            const resourceUrl = new URL(path, baseUrl);
            await fetchIncapsulaResource(resourceUrl, origin, baseUrl);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            log.debug(`[Copart] Falha ao processar recurso Incapsula (${path}): ${message}`);
        }
    }
}

async function fetchIncapsulaResource(resourceUrl: URL, origin: string, referer: URL): Promise<void> {
    const headers: Record<string, string> = {
        ...COPART_DEFAULT_HEADERS,
        Accept: 'application/javascript, text/javascript;q=0.9, */*;q=0.1',
        Referer: referer.toString(),
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'same-origin',
    };

    const existing = SESSION_COOKIES.get(origin);
    if (existing) {
        headers.Cookie = existing;
    }

    const response = await fetch(resourceUrl, {
        method: 'GET',
        headers,
    });

    if (!response.ok) {
        const text = await response.text().catch(() => null);
        throw new Error(
            `[Copart] ${response.status} ${response.statusText} ao obter ${resourceUrl.toString()}${text ? `: ${text}` : ''}`,
        );
    }

    updateSessionCookies(origin, response.headers);

    const script = await response.text().catch(() => null);
    if (script) {
        const statements = extractDocumentCookieStatements(script);
        if (statements.length > 0) {
            applyDocumentCookieStatements(origin, statements);
        }
    }
}

function extractSetCookies(headers: Headers): string[] {
    const headerWithGet = (headers as unknown as { getSetCookie?: () => string[] }).getSetCookie?.();
    if (headerWithGet && headerWithGet.length > 0) {
        return headerWithGet;
    }

    const raw = (headers as unknown as { raw?: () => Record<string, string[]> }).raw?.();
    if (raw && Array.isArray(raw['set-cookie'])) {
        return raw['set-cookie'];
    }

    const single = headers.get('set-cookie');
    return single ? [single] : [];
}

function mergeCookies(existing: string | null, setCookies: string[]): string | null {
    const map = cookieHeaderToMap(existing ?? '');
    let updated = false;

    for (const cookie of setCookies) {
        const pair = cookie.split(';', 1)[0]?.trim();
        if (!pair) continue;

        const separatorIndex = pair.indexOf('=');
        if (separatorIndex === -1) continue;

        const name = pair.slice(0, separatorIndex).trim();
        const value = pair.slice(separatorIndex + 1).trim();
        if (!name) continue;

        map.set(name, value);
        updated = true;
    }

    if (!updated && existing) {
        return existing;
    }

    if (map.size === 0) {
        return null;
    }

    return Array.from(map.entries())
        .map(([name, value]) => `${name}=${value}`)
        .join('; ');
}

function cookieHeaderToMap(header: string): Map<string, string> {
    const map = new Map<string, string>();
    if (!header) {
        return map;
    }

    for (const segment of header.split(';')) {
        const trimmed = segment.trim();
        if (!trimmed) continue;

        const separatorIndex = trimmed.indexOf('=');
        if (separatorIndex === -1) continue;

        const name = trimmed.slice(0, separatorIndex).trim();
        const value = trimmed.slice(separatorIndex + 1).trim();
        if (!name) continue;

        map.set(name, value);
    }

    return map;
}

function extractDocumentCookieStatements(source: string): string[] {
    const results: string[] = [];
    const regex = /document\.cookie\s*=\s*(["'])(.*?)\1/gi;

    for (const match of source.matchAll(regex)) {
        if (match[2]) {
            results.push(match[2]);
        }
    }

    return results;
}

function applyDocumentCookieStatements(origin: string, statements: string[]): void {
    if (statements.length === 0) {
        return;
    }

    const merged = mergeCookies(SESSION_COOKIES.get(origin) ?? null, statements);
    if (merged) {
        SESSION_COOKIES.set(origin, merged);
    }
}

function invalidateSession(origin: string): void {
    SESSION_COOKIES.delete(origin);
}

async function copartFetchJson(
    url: URL,
    options: {
        method: 'GET' | 'POST';
        origin: string;
        body?: JsonRecord;
        allowError?: boolean;
    },
): Promise<unknown> {
    for (let attempt = 0; attempt < 2; attempt++) {
        const headers: Record<string, string> = {
            ...COPART_DEFAULT_HEADERS,
            Origin: options.origin,
            Referer: `${options.origin}/`,
        };

        if (options.method !== 'GET') {
            headers['Content-Type'] = 'application/json';
        }

        const cookieHeader = await prepareCopartSession(options.origin, attempt > 0);
        if (cookieHeader) {
            headers.Cookie = cookieHeader;
        }

        const response = await fetch(url, {
            method: options.method,
            headers,
            body: options.body ? JSON.stringify(options.body) : undefined,
        });

        updateSessionCookies(options.origin, response.headers);

        if (!response.ok) {
            if (attempt === 0 && (response.status === 401 || response.status === 403)) {
                invalidateSession(options.origin);
                continue;
            }

            const text = await response.text();
            const message = `[Copart] ${response.status} ${response.statusText} em ${url.toString()}${text ? `: ${text}` : ''}`;
            if (options.allowError) {
                throw new CopartFetchError(message, response.status);
            }
            throw new Error(message);
        }

        if (response.status === 204) {
            return null;
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.toLowerCase().includes('application/json')) {
            if (attempt === 0) {
                invalidateSession(options.origin);
                // Consume body to avoid leaking the stream before retrying.
                await response.text();
                continue;
            }

            const text = await response.text();
            throw new Error(`[Copart] Resposta inesperada (não JSON) em ${url.toString()}: ${text.slice(0, 200)}`);
        }

        return response.json();
    }

    throw new Error(`[Copart] Falha ao obter dados em ${url.toString()} após múltiplas tentativas.`);
}

function buildDatasetItem(data: EnrichedLotData): JsonRecord {
    const candidates = gatherCandidates(data.baseLot, data.lotDetails, data.dynamicLot, data.damageDetails, data.buildSheet);

    const { lotNumber } = data;
    const year = pickNumber(candidates, ['year', 'yr', 'modelYear']);
    const make = pickString(candidates, ['make', 'mk', 'brand']);
    const model = pickString(candidates, ['model', 'md', 'series', 'modelGroup']);
    const trim = pickString(candidates, ['trim', 'subModel', 'seriesName']);
    const vin = pickString(candidates, ['vin', 'vehicleVin', 'vinNumber']);

    const saleStatus = pickString(candidates, ['saleStatus', 'sale_status', 'lotStatus', 'status']);
    const currentBid = pickNumber(candidates, [
        'currentBid',
        'current_bid',
        'currentBidAmount',
        'bidAmount',
        'ci',
        'bbid',
        'currentBidValue',
        'lastBidAmount',
    ]);
    const buyNow = pickNumber(candidates, ['buyItNowPrice', 'buy_now', 'binPrice', 'buyNowPrice']);
    const retailValue = pickNumber(candidates, ['estimatedRetailValue', 'retailValue', 'retail_value', 'repairCost']);

    const auctionDate = pickDate(candidates, ['auctionDate', 'auction_date', 'auctionDateLocal', 'auctionStartDate', 'auctionDateTime']);
    const auctionTime = pickString(candidates, ['auctionTime', 'auction_time', 'auctionTimeLocal', 'auctionStartTime']);

    const saleLocation = pickString(candidates, ['saleLocation', 'location', 'yardName', 'lotLocation', 'locationName', 'locationCityState']);
    const locationCountry = pickString(candidates, ['locationCountry', 'country', 'countryName']);
    const locationState = pickString(candidates, ['locationState', 'state', 'stateProvince']);
    const locationCity = pickString(candidates, ['locationCity', 'city', 'locationCityName']);
    const latitude = pickNumber(candidates, ['latitude', 'lat']);
    const longitude = pickNumber(candidates, ['longitude', 'lon', 'lng']);
    const zipCode = pickString(candidates, ['zip', 'zipCode', 'postalCode']);

    const bodyStyle = pickString(candidates, ['bodyStyle', 'body_style', 'vehicleBodyStyle', 'bs']);
    const color = pickString(candidates, ['color', 'clr', 'vehicleColor']);
    const engine = pickString(candidates, ['engine', 'engineType', 'eng']);
    const transmission = pickString(candidates, ['transmission', 'transmissionType', 'tm']);
    const drive = pickString(candidates, ['drive', 'driveLine', 'drive_train', 'drivetrain', 'driveType']);
    const fuel = pickString(candidates, ['fuel', 'fuelType', 'ft']);

    const odometer = pickString(candidates, ['odometer', 'odometerReading', 'odometer_reading', 'odometerValue']);
    const odometerStatus = pickString(candidates, ['odometerStatus', 'odometer_status', 'odometerStatusDesc', 'odometerStatusDescription']);
    const primaryDamage = pickString(candidates, ['primaryDamage', 'primary_damage', 'pd']);
    const secondaryDamage = pickString(candidates, ['secondaryDamage', 'secondary_damage', 'sd']);
    const docType = pickString(candidates, ['docType', 'documentType', 'titleType', 'documentDescription', 'title']);
    const highlights = pickString(candidates, ['highlights', 'vehicleHighlights', 'hl']);

    const thumbnailImages = collectMedia(candidates, [
        'images_thumbnail',
        'imagesThumbnail',
        'imageThumbnail',
        'thumbnailImages',
        'imageThumb',
        'thumbnailUrl',
        'images',
    ], data.origin);
    const fullImages = collectMedia(candidates, [
        'images_full',
        'imagesFull',
        'imageFull',
        'fullImages',
        'imageUrl',
        'primaryImageUrl',
        'image',
    ], data.origin);
    const highResImages = collectMedia(candidates, [
        'images_high_res',
        'imagesHighRes',
        'highResolutionImages',
        'imageHighRes',
        'imageHiRes',
    ], data.origin);
    const engineVideos = collectMedia(candidates, [
        'engine_video',
        'engineVideo',
        'engineVideoHighRes',
        'engineVideoHighResUrl',
    ], data.origin);

    const imageUrl = thumbnailImages[0] ?? fullImages[0] ?? highResImages[0] ?? null;

    const dynamicLotNormalized = extractRelevantObject(data.dynamicLot);
    const buildSheetNormalized = extractRelevantObject(data.buildSheet);
    const damageNormalized = extractRelevantObject(data.damageDetails);
    const lotDetailsNormalized = extractRelevantObject(data.lotDetails);

    const dynamicPrefixed = prefixFlatFields(dynamicLotNormalized, 'dynamic_lot_');

    const datasetItem: JsonRecord = {
        source_url: buildLotUrl(data.origin, lotNumber, data.slug, candidates) ?? null,
        scrapedTimestamp: new Date().toISOString(),
        lot_number: lotNumber,
        vin: vin ?? null,
        year: typeof year === 'number' && Number.isFinite(year) ? Math.round(year) : null,
        make: make ?? null,
        model: model ?? null,
        trim: trim ?? null,
        sale_status: saleStatus ?? null,
        current_bid: currentBid ?? null,
        buy_it_now_price: buyNow ?? null,
        estimated_retail_value: retailValue ?? null,
        auction_date: auctionDate ? auctionDate.getTime() : null,
        auction_date_iso: auctionDate ? auctionDate.toISOString() : null,
        auction_time: auctionTime ?? null,
        sale_location: saleLocation ?? null,
        location_country: locationCountry ?? null,
        location_state: locationState ?? null,
        location_city: locationCity ?? null,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        zip_code: zipCode ?? null,
        body_style: bodyStyle ?? null,
        color: color ?? null,
        engine: engine ?? null,
        transmission: transmission ?? null,
        drive: drive ?? null,
        fuel: fuel ?? null,
        odometer: odometer ?? null,
        odometer_status: odometerStatus ?? null,
        primary_damage: primaryDamage ?? null,
        secondary_damage: secondaryDamage ?? null,
        doc_type: docType ?? null,
        highlights: highlights ?? null,
        imageUrl: imageUrl ?? null,
        images_thumbnail: thumbnailImages,
        images_full: fullImages,
        images_high_res: highResImages,
        engine_video_high_res: engineVideos,
        damage_details: damageNormalized,
        build_sheet: buildSheetNormalized,
        dynamic_lot_details: dynamicLotNormalized,
        lot_details: lotDetailsNormalized,
        search_result: data.baseLot,
    };

    for (const [key, value] of Object.entries(dynamicPrefixed)) {
        datasetItem[key] = value;
    }

    return datasetItem;
}

function gatherCandidates(...sources: unknown[]): JsonRecord[] {
    const results: JsonRecord[] = [];
    const stack = [...sources];
    const seen = new Set<unknown>();

    while (stack.length > 0) {
        const current = stack.pop();
        if (!isRecord(current)) {
            continue;
        }
        if (seen.has(current)) {
            continue;
        }
        seen.add(current);
        results.push(current);

        if (isRecord(current.data)) {
            stack.push(current.data);
        }
        if (isRecord(current.results)) {
            stack.push(current.results);
        }
        if (isRecord(current.lotDetails)) {
            stack.push(current.lotDetails);
        }
        if (isRecord(current.dynamicLotDetails)) {
            stack.push(current.dynamicLotDetails);
        }
        if (Array.isArray(current.content)) {
            for (const item of current.content) {
                stack.push(item);
            }
        }
    }

    return results;
}

function pickLotNumber(lot: JsonRecord | null | undefined): string | null {
    if (!lot) return null;
    return (
        pickString([lot], ['lotNumber', 'lot_number', 'lotNo', 'lotNumberStr', 'lot_id', 'ln', 'lot']) ??
        pickString([lot], ['id', 'identifier']) ??
        null
    );
}

function pickString(candidates: JsonRecord[], keys: string[]): string | null {
    for (const candidate of candidates) {
        for (const key of keys) {
            if (!(key in candidate)) continue;
            const value = candidate[key];

            if (typeof value === 'string') {
                const normalized = value.trim();
                if (normalized.length > 0) {
                    return normalized;
                }
            }

            if (typeof value === 'number' && Number.isFinite(value)) {
                return String(value);
            }

            if (Array.isArray(value)) {
                for (const item of value) {
                    if (typeof item === 'string') {
                        const normalized = item.trim();
                        if (normalized.length > 0) {
                            return normalized;
                        }
                    }
                }
            }
        }
    }

    return null;
}

function pickNumber(candidates: JsonRecord[], keys: string[]): number | null {
    for (const candidate of candidates) {
        for (const key of keys) {
            if (!(key in candidate)) continue;
            const value = candidate[key];

            if (typeof value === 'number' && Number.isFinite(value)) {
                return value;
            }

            if (typeof value === 'string') {
                const cleaned = value.replace(NUMBER_SANITIZE_REGEX, '').replace(/,(?=[0-9]{3}\b)/g, '').replace(/,/g, '.');
                if (cleaned.length === 0) {
                    continue;
                }
                const parsed = Number.parseFloat(cleaned);
                if (!Number.isNaN(parsed)) {
                    return parsed;
                }
            }
        }
    }

    return null;
}

function pickDate(candidates: JsonRecord[], keys: string[]): Date | null {
    for (const candidate of candidates) {
        for (const key of keys) {
            if (!(key in candidate)) continue;
            const value = candidate[key];

            if (value instanceof Date) {
                return value;
            }

            if (typeof value === 'number' && Number.isFinite(value)) {
                const timestamp = value > 1_000_000_000_000 ? value : value * 1000;
                const parsed = new Date(timestamp);
                if (!Number.isNaN(parsed.getTime())) {
                    return parsed;
                }
            }

            if (typeof value === 'string') {
                const trimmed = value.trim();
                if (trimmed.length === 0) {
                    continue;
                }

                const numeric = Number(trimmed);
                if (!Number.isNaN(numeric)) {
                    const parsed = pickDate([{ temp: numeric }], ['temp']);
                    if (parsed) {
                        return parsed;
                    }
                }

                const normalized = trimmed.replace(/\bàs\b/gi, '').replace(/\s+/g, ' ').trim();
                const parsed = new Date(normalized);
                if (!Number.isNaN(parsed.getTime())) {
                    return parsed;
                }
            }
        }
    }

    return null;
}

function collectMedia(candidates: JsonRecord[], keys: string[], origin: string): string[] {
    const result = new Set<string>();

    for (const candidate of candidates) {
        for (const key of keys) {
            if (!(key in candidate)) continue;
            const value = candidate[key];

            if (typeof value === 'string') {
                const normalized = normalizeUrl(value, origin);
                if (normalized) {
                    result.add(normalized);
                }
            } else if (Array.isArray(value)) {
                for (const item of value) {
                    if (typeof item === 'string') {
                        const normalized = normalizeUrl(item, origin);
                        if (normalized) {
                            result.add(normalized);
                        }
                    } else if (isRecord(item)) {
                        for (const nestedKey of ['url', 'imageUrl', 'thumbnailUrl', 'fullUrl']) {
                            if (!(nestedKey in item)) continue;
                            const nestedValue = item[nestedKey];
                            if (typeof nestedValue === 'string') {
                                const normalized = normalizeUrl(nestedValue, origin);
                                if (normalized) {
                                    result.add(normalized);
                                }
                            }
                        }
                    }
                }
            } else if (isRecord(value)) {
                for (const nestedKey of ['url', 'imageUrl', 'thumbnailUrl', 'fullUrl']) {
                    if (!(nestedKey in value)) continue;
                    const nestedValue = value[nestedKey];
                    if (typeof nestedValue === 'string') {
                        const normalized = normalizeUrl(nestedValue, origin);
                        if (normalized) {
                            result.add(normalized);
                        }
                    }
                }
            }
        }
    }

    return Array.from(result);
}

function normalizeUrl(url: unknown, origin: string): string | null {
    if (typeof url !== 'string') return null;
    const trimmed = url.trim();
    if (trimmed.length === 0) return null;

    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return trimmed;
    }

    if (trimmed.startsWith('//')) {
        return `https:${trimmed}`;
    }

    if (trimmed.startsWith('/')) {
        try {
            return new URL(trimmed, origin).toString();
        } catch {
            return `https://www.copart.com.br${trimmed}`;
        }
    }

    try {
        return new URL(trimmed, origin).toString();
    } catch {
        return trimmed;
    }
}

function extractRelevantObject(data: unknown): unknown {
    if (!isRecord(data)) {
        return data ?? null;
    }

    if (isRecord(data.data)) {
        return extractRelevantObject(data.data);
    }

    if (isRecord(data.lotDetails)) {
        return extractRelevantObject(data.lotDetails);
    }

    return data;
}

function prefixFlatFields(source: unknown, prefix: string): JsonRecord {
    if (!isRecord(source)) {
        return {};
    }

    const result: JsonRecord = {};
    for (const [key, value] of Object.entries(source)) {
        if (value === null || typeof value === 'undefined') {
            continue;
        }
        if (typeof value === 'object') {
            continue;
        }
        const normalizedKey = `${prefix}${toSnakeCase(key)}`;
        result[normalizedKey] = value;
    }

    return result;
}

function toSnakeCase(value: string): string {
    return value
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
        .replace(/[-\s]+/g, '_')
        .replace(/__+/g, '_')
        .toLowerCase();
}

function buildLotUrl(origin: string, lotNumber: string, slug: string | null | undefined, candidates: JsonRecord[]): string | null {
    const lotUrl = candidates
        .map((candidate) => {
            const url = pickString([candidate], ['lotUrl', 'url', 'detailUrl']);
            if (url && url.includes(lotNumber)) {
                return url;
            }
            return null;
        })
        .find((candidateUrl) => candidateUrl !== null);

    if (lotUrl) {
        return lotUrl;
    }

    const safeSlug = slug && slug.length > 0 ? slug : lotNumber;
    try {
        const resolved = new URL(`/lot/${safeSlug}`, origin);
        return resolved.toString();
    } catch {
        return null;
    }
}

function deriveSearchTerm(url: URL): string | null {
    const queryParam = url.searchParams.get('query') ?? url.searchParams.get('q');
    if (queryParam && queryParam.trim().length > 0) {
        return queryParam.trim();
    }

    const freeForm = url.searchParams.get('freeFormSearch');
    if (freeForm && freeForm.trim().length > 0) {
        return freeForm.trim();
    }

    const displayStr = url.searchParams.get('displayStr');
    if (displayStr && displayStr.trim().length > 0) {
        return decodeURIComponent(displayStr.trim());
    }

    const segments = url.pathname.split('/').filter((segment) => segment.length > 0);
    if (segments.length > 0) {
        const last = segments[segments.length - 1];
        if (last && last.toLowerCase() !== 'search') {
            try {
                const decoded = decodeURIComponent(last);
                if (decoded && decoded.length > 0) {
                    return decoded;
                }
            } catch {
                return last;
            }
        }
    }

    return null;
}

function tryParseSearchCriteria(raw: string | null): CopartSearchCriteria | undefined {
    if (!raw) return undefined;
    try {
        const decoded = decodeURIComponent(raw);
        const parsed = JSON.parse(decoded);
        return isRecord(parsed) ? (parsed as CopartSearchCriteria) : undefined;
    } catch {
        try {
            const parsed = JSON.parse(raw);
            return isRecord(parsed) ? (parsed as CopartSearchCriteria) : undefined;
        } catch {
            return undefined;
        }
    }
}

function sanitizeMaxItems(maxItems: unknown): number | undefined {
    if (typeof maxItems !== 'number') return undefined;
    if (!Number.isFinite(maxItems)) return undefined;
    const rounded = Math.floor(maxItems);
    if (rounded <= 0) return undefined;
    return rounded;
}

function sanitizePageSize(size: number | null): number | undefined {
    if (typeof size !== 'number' || !Number.isFinite(size)) {
        return undefined;
    }
    const rounded = Math.min(Math.max(Math.floor(size), MIN_PAGE_SIZE), MAX_PAGE_SIZE);
    if (rounded <= 0) {
        return undefined;
    }
    return rounded;
}

function parsePositiveInteger(value: Maybe<string | number>): number | undefined {
    if (typeof value === 'number') {
        if (!Number.isFinite(value)) return undefined;
        const rounded = Math.floor(value);
        return rounded > 0 ? rounded : undefined;
    }

    if (typeof value === 'string') {
        const parsed = Number.parseInt(value, 10);
        if (!Number.isNaN(parsed) && parsed > 0) {
            return parsed;
        }
    }

    return undefined;
}

function isRecord(value: unknown): value is JsonRecord {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
