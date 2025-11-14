import axios from "axios";

import type { InsertVehicle } from "../../drizzle/schema";

function parsePositiveInteger(value: string | undefined, fallback: number): number {
  if (!value) return fallback;

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

function parseOptionalPositiveInteger(value: string | undefined): number | undefined {
  if (!value) return undefined;

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return undefined;
  }

  return parsed;
}

function sanitizeMaxItems(value: number | undefined): number | undefined {
  if (typeof value !== "number") return undefined;

  if (!Number.isFinite(value)) {
    return undefined;
  }

  const rounded = Math.floor(value);
  if (rounded <= 0) {
    return undefined;
  }

  return rounded;
}

const COPART_SEARCH_URL =
  process.env.COPART_SEARCH_URL ?? "https://www.copart.com.br/public/data/lots/search";
const COPART_SEARCH_FALLBACK_URL =
  process.env.COPART_SEARCH_FALLBACK_URL ??
  "https://www.copart.com.br/public/data/lots/search-results";
const DEFAULT_PAGE_SIZE = parsePositiveInteger(process.env.COPART_PAGE_SIZE, 100);
const DEFAULT_MAX_PAGES = parsePositiveInteger(process.env.COPART_MAX_PAGES, 5);

const APIFY_API_BASE_URL = process.env.APIFY_API_BASE_URL ?? "https://api.apify.com/v2";
const APIFY_ACTOR_ID =
  process.env.APIFY_ACTOR_ID ?? "parseforge~copart-public-search-scraper";
const APIFY_TOKEN = process.env.APIFY_API_TOKEN ?? process.env.APIFY_TOKEN ?? null;
const APIFY_START_URL =
  process.env.COPART_APIFY_START_URL ??
  "https://www.copart.com/lotSearchResults/?freeFormSearch=&query=";
const APIFY_DATASET_PAGE_SIZE = Math.min(
  1000,
  parsePositiveInteger(process.env.COPART_APIFY_PAGE_SIZE, 1000),
);
const APIFY_RUN_POLL_INTERVAL_MS = parsePositiveInteger(
  process.env.COPART_APIFY_POLL_INTERVAL_MS,
  5000,
);
const APIFY_RUN_TIMEOUT_MS = Math.max(
  APIFY_RUN_POLL_INTERVAL_MS,
  parsePositiveInteger(process.env.COPART_APIFY_TIMEOUT_MS, 600_000),
);
const APIFY_DEFAULT_MAX_ITEMS = parseOptionalPositiveInteger(
  process.env.COPART_APIFY_MAX_ITEMS,
);

interface CopartSearchPayload {
  page: number;
  size: number;
  freeFormSearch?: string;
  query?: string;
  sort?: Array<{ field: string; direction: "ASC" | "DESC" }> | string;
  filters?: unknown;
}

interface CopartSearchResponse {
  data?: {
    results?: {
      content?: CopartLot[];
      totalElements?: number;
    };
  };
  results?: {
    content?: CopartLot[];
    totalElements?: number;
  };
  content?: CopartLot[];
}

export type CopartLot = Record<string, unknown>;

const httpClient = axios.create({
  timeout: 15000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) CopartMirror/1.0",
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    "Content-Type": "application/json",
    Origin: "https://www.copart.com.br",
    Referer: "https://www.copart.com.br/",
  },
});

const apifyClient = axios.create({
  baseURL: APIFY_API_BASE_URL,
  timeout: Math.max(60_000, APIFY_RUN_POLL_INTERVAL_MS * 2),
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "User-Agent": "CopartMirror/ApifyClient/1.0",
  },
});

interface ApifyRunData {
  id?: string;
  status?: string;
  defaultDatasetId?: string | null;
}

interface ApifyRunEnvelope {
  data?: ApifyRunData;
}

function ensureApifyToken(): string {
  if (APIFY_TOKEN && APIFY_TOKEN.trim().length > 0) {
    return APIFY_TOKEN;
  }

  throw new Error(
    "[Copart] Token APIFY_API_TOKEN não configurado. Defina a variável de ambiente para habilitar o scraper.",
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildApifyStartUrl(searchTerm: string): string {
  const trimmed = searchTerm.trim();

  try {
    const url = new URL(APIFY_START_URL);
    if (trimmed.length > 0) {
      url.searchParams.set("freeFormSearch", trimmed);
      url.searchParams.set("query", trimmed);
    }

    return url.toString();
  } catch (error) {
    console.warn(
      `[Copart] URL base para o scraper da Apify inválida (${APIFY_START_URL}). Retornando valor bruto.`,
    );

    if (trimmed.length === 0) {
      return APIFY_START_URL;
    }

    const encodedTerm = encodeURIComponent(trimmed);
    return APIFY_START_URL.includes("?")
      ? `${APIFY_START_URL}&freeFormSearch=${encodedTerm}&query=${encodedTerm}`
      : `${APIFY_START_URL}?freeFormSearch=${encodedTerm}&query=${encodedTerm}`;
  }
}

async function startApifyActorRun(
  startUrl: string,
  maxItems?: number,
): Promise<{ runId: string; datasetId?: string | null }> {
  const token = ensureApifyToken();
  const payload: Record<string, unknown> = { startUrl };

  if (typeof maxItems === "number" && Number.isFinite(maxItems) && maxItems > 0) {
    payload.maxItems = Math.min(maxItems, 1_000_000);
  }

  const actorPath = `/acts/${encodeURIComponent(APIFY_ACTOR_ID)}/runs`;
  const response = await apifyClient.post<ApifyRunEnvelope>(actorPath, payload, {
    params: { token },
  });

  const run = response.data?.data;
  const runId = run?.id;

  if (!runId) {
    throw new Error("[Copart] Execução do scraper da Apify não retornou um ID de run válido.");
  }

  return {
    runId,
    datasetId: run?.defaultDatasetId ?? null,
  };
}

async function waitForApifyRunCompletion(
  runId: string,
  initialDatasetId?: string | null,
): Promise<string> {
  const token = ensureApifyToken();
  const encodedRunId = encodeURIComponent(runId);
  const startTime = Date.now();
  let datasetId = initialDatasetId ?? null;

  for (;;) {
    if (Date.now() - startTime > APIFY_RUN_TIMEOUT_MS) {
      throw new Error(
        `[Copart] Tempo limite excedido ao aguardar conclusão do scraper na Apify (run ${runId}).`,
      );
    }

    const response = await apifyClient.get<ApifyRunEnvelope>(`/actor-runs/${encodedRunId}`, {
      params: { token },
    });

    const run = response.data?.data;
    const status = run?.status?.toUpperCase() ?? "";

    if (run?.defaultDatasetId) {
      datasetId = run.defaultDatasetId;
    }

    if (status === "SUCCEEDED" || status === "COMPLETED") {
      if (!datasetId) {
        throw new Error(
          `[Copart] Run ${runId} concluído na Apify, porém nenhum dataset foi disponibilizado.`,
        );
      }

      return datasetId;
    }

    if (["FAILED", "ABORTED", "TIMED_OUT", "ABORTING"].includes(status)) {
      throw new Error(`[Copart] Execução do scraper na Apify falhou com status ${status}.`);
    }

    await sleep(APIFY_RUN_POLL_INTERVAL_MS);
  }
}

async function fetchApifyDatasetItems(datasetId: string, maxItems?: number): Promise<CopartLot[]> {
  const token = ensureApifyToken();
  const encodedDatasetId = encodeURIComponent(datasetId);
  const items: CopartLot[] = [];
  let offset = 0;

  for (;;) {
    const remaining =
      typeof maxItems === "number" && Number.isFinite(maxItems) ? maxItems - items.length : undefined;

    if (typeof remaining === "number" && remaining <= 0) {
      break;
    }

    const limit = typeof remaining === "number"
      ? Math.min(APIFY_DATASET_PAGE_SIZE, remaining)
      : APIFY_DATASET_PAGE_SIZE;

    const response = await apifyClient.get<unknown>(`/datasets/${encodedDatasetId}/items`, {
      params: {
        token,
        clean: 1,
        format: "json",
        offset,
        limit,
      },
    });

    const rawData = response.data;
    const batch = Array.isArray(rawData) ? (rawData as CopartLot[]) : [];

    if (batch.length === 0) {
      break;
    }

    items.push(...batch);
    offset += batch.length;

    if (batch.length < limit) {
      break;
    }
  }

  return items;
}

async function fetchCopartInventoryFromApify(
  searchTerm: string,
  maxItems?: number,
): Promise<CopartLot[]> {
  const sanitizedMaxItems = sanitizeMaxItems(maxItems) ?? APIFY_DEFAULT_MAX_ITEMS;
  const startUrl = buildApifyStartUrl(searchTerm);

  console.log(`[Copart] Iniciando coleta via Apify para URL: ${startUrl}`);

  const { runId, datasetId: initialDatasetId } = await startApifyActorRun(
    startUrl,
    sanitizedMaxItems,
  );

  const datasetId = await waitForApifyRunCompletion(runId, initialDatasetId);
  console.log(`[Copart] Run ${runId} concluído. Dataset: ${datasetId}`);

  const items = await fetchApifyDatasetItems(datasetId, sanitizedMaxItems);
  console.log(`[Copart] ${items.length} registros retornados pelo scraper da Apify.`);

  return items;
}

async function fetchCopartInventoryFromCopartApi(options?: {
  maxPages?: number;
  pageSize?: number;
  searchTerm?: string;
}): Promise<CopartLot[]> {
  const pageSize = Math.max(1, options?.pageSize ?? DEFAULT_PAGE_SIZE);
  const maxPages = Math.max(1, options?.maxPages ?? DEFAULT_MAX_PAGES);
  const searchTerm = options?.searchTerm?.trim() ?? "";

  const inventory: CopartLot[] = [];

  for (let page = 0; page < maxPages; page++) {
    const lots = await fetchCopartSearchPage(page, pageSize, searchTerm);

    if (lots.length === 0) {
      break;
    }

    inventory.push(...lots);

    if (lots.length < pageSize) {
      break;
    }
  }

  return inventory;
}

function extractContent(response: CopartSearchResponse): CopartLot[] {
  const nestedContent =
    response?.data?.results?.content ??
    response?.results?.content ??
    response?.content ??
    [];

  if (Array.isArray(nestedContent)) {
    return nestedContent;
  }

  return [];
}

function normalizeString(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return null;
}

function pickString(lot: CopartLot, keys: string[]): string | null {
  for (const key of keys) {
    if (!(key in lot)) continue;
    const rawValue = lot[key];

    if (Array.isArray(rawValue)) {
      for (const item of rawValue) {
        const normalized = normalizeString(item);
        if (normalized) {
          return normalized;
        }
      }
      continue;
    }

    const normalized = normalizeString(rawValue);
    if (normalized) {
      return normalized;
    }
  }

  return null;
}

function pickNumber(lot: CopartLot, keys: string[]): number | null {
  for (const key of keys) {
    if (!(key in lot)) continue;
    const value = lot[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string") {
      const cleaned = value
        .replace(/[^0-9.,-]/g, "")
        .replace(/,(?=[0-9]{3}\b)/g, "")
        .replace(/,/g, ".")
        .trim();

      if (cleaned.length === 0) {
        continue;
      }

      const parsed = Number.parseFloat(cleaned);
      if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return null;
}

function pickDate(lot: CopartLot, keys: string[]): Date | null {
  for (const key of keys) {
    if (!(key in lot)) continue;
    const value = lot[key];

    if (value instanceof Date) {
      return value;
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      const timestamp = value > 1_000_000_000_000 ? value : value * 1000;
      const parsed = new Date(timestamp);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed.length === 0) {
        continue;
      }

      const numeric = Number(trimmed);
      if (!Number.isNaN(numeric)) {
        const parsed = pickDate({ temp: numeric }, ["temp"]);
        if (parsed) {
          return parsed;
        }
      }

      const normalized = trimmed
        .replace(/\bàs\b/gi, "")
        .replace(/\s+/g, " ")
        .trim();

      const parsed = new Date(normalized);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }
  }

  return null;
}

function toCents(value: number | null): number {
  if (value === null || Number.isNaN(value)) {
    return 0;
  }

  const absolute = Math.abs(value);

  if (absolute === 0) {
    return 0;
  }

  if (absolute > 100_000 && Number.isInteger(value)) {
    // Valores muito altos costumam já estar em centavos
    return Math.round(value);
  }

  return Math.round(value * 100);
}

function normalizeImageUrl(url: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (trimmed.length === 0) {
    return null;
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  if (trimmed.startsWith("/")) {
    return `https://www.copart.com.br${trimmed}`;
  }

  return trimmed;
}

function buildDescription(lot: CopartLot): string {
  const parts: string[] = [];

  const condition = pickString(lot, ["condition", "vehicleCondition", "cond"]);
  const primaryDamage = pickString(lot, ["primaryDamage", "primary_damage", "pd"]);
  const secondaryDamage = pickString(lot, ["secondaryDamage", "secondary_damage", "sd"]);
  const highlights = pickString(lot, ["highlights", "vehicleHighlights", "hl"]);

  if (condition) parts.push(condition);
  if (primaryDamage) parts.push(`Dano: ${primaryDamage}`);
  if (secondaryDamage) parts.push(`Dano secundário: ${secondaryDamage}`);
  if (highlights) parts.push(highlights);

  if (parts.length === 0) {
    return "Informações de condição não disponíveis";
  }

  return parts.join(" | ");
}

export async function fetchCopartSearchPage(
  page: number,
  pageSize: number,
  searchTerm: string = ""
): Promise<CopartLot[]> {
  const payload: CopartSearchPayload = {
    page,
    size: pageSize,
    freeFormSearch: searchTerm,
    query: searchTerm,
    sort: [
      { field: "auctionDate", direction: "ASC" },
      { field: "lotNumber", direction: "ASC" },
    ],
    filters: [],
  };

  try {
    const response = await httpClient.post<CopartSearchResponse>(
      COPART_SEARCH_URL,
      payload
    );

    return extractContent(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? "sem status";
      const statusText = error.response?.statusText ?? "";

      if (error.response?.status && [403, 404, 405, 415].includes(error.response.status)) {
        try {
          console.warn(
            `[Copart] Endpoint principal retornou ${error.response.status}. Tentando fallback (página ${page}).`
          );
          const fallbackResponse = await httpClient.get<CopartSearchResponse>(
            COPART_SEARCH_FALLBACK_URL,
            {
              params: {
                page,
                size: pageSize,
                freeFormSearch: searchTerm,
                query: searchTerm,
              },
            }
          );

          return extractContent(fallbackResponse.data);
        } catch (fallbackError) {
          const fallbackMessage =
            fallbackError instanceof Error
              ? fallbackError.message
              : 'Falha desconhecida no fallback da Copart';
          console.error(`[Copart] Fallback falhou: ${fallbackMessage}`);
        }
      }

      const message = `[Copart] Erro ao buscar página ${page}: ${status} ${statusText}`.trim();
      console.error(message);
      throw new Error(message);
    }

    console.error(`[Copart] Erro inesperado ao buscar página ${page}:`, error);
    throw error instanceof Error ? error : new Error('Falha desconhecida ao consultar Copart');
  }
}

export async function fetchCopartInventory(options?: {
  maxPages?: number;
  pageSize?: number;
  searchTerm?: string;
  maxItems?: number;
}): Promise<CopartLot[]> {
  const searchTerm = options?.searchTerm?.trim() ?? "";
  const maxItems = sanitizeMaxItems(options?.maxItems);

  if (APIFY_TOKEN && APIFY_TOKEN.trim().length > 0) {
    try {
      return await fetchCopartInventoryFromApify(searchTerm, maxItems);
    } catch (error) {
      console.error("[Copart] Falha ao coletar dados via Apify:", error);
      console.warn("[Copart] Utilizando fallback direto na API pública (resultado limitado).");
      return fetchCopartInventoryFromCopartApi({
        maxPages: options?.maxPages,
        pageSize: options?.pageSize,
        searchTerm,
      });
    }
  }

  console.warn(
    "[Copart] Token APIFY_API_TOKEN não configurado. Utilizando integração direta com a API pública da Copart.",
  );

  return fetchCopartInventoryFromCopartApi({
    maxPages: options?.maxPages,
    pageSize: options?.pageSize,
    searchTerm,
  });
}

export function transformCopartLot(lot: CopartLot): InsertVehicle {
  const lotNumber =
    pickString(lot, ["lotNumber", "lot_number", "ln", "lot", "lotNo", "lot_id", "lotNumberStr"])
      ?.replace(/[^0-9A-Za-z-]/g, "") ?? "";

  const year = pickNumber(lot, ["year", "yr", "modelYear"]);
  const brand = pickString(lot, ["make", "mk", "brand"]);
  const model = pickString(lot, ["model", "md", "series"]);
  const trim = pickString(lot, ["trim", "seriesName", "subModel"]);

  const titleParts = [year ? String(Math.round(year)) : null, brand, model, trim]
    .filter((part): part is string => !!part && part.length > 0);
  const title =
    titleParts.join(" ").trim() ||
    (lotNumber ? `Lote ${lotNumber}` : "Veículo disponível");

  const location = pickString(lot, [
    "location",
    "saleLocation",
    "yardName",
    "yn",
    "city",
    "locationName",
    "lotLocation",
    "locationCityState",
  ]);

  const currentBidValue = pickNumber(lot, [
    "currentBid",
    "current_bid",
    "bid",
    "currentBidAmount",
    "buyItNowPrice",
    "ci",
    "bbid",
  ]);

  const mileage = pickNumber(lot, ["odometer", "odometerReading", "odometer_reading", "od", "odrd"]);
  const fuel = pickString(lot, ["fuel", "fuelType", "ft"]);
  const transmission = pickString(lot, ["transmission", "tm", "transmissionType"]);
  const color = pickString(lot, ["color", "clr"]);
  const condition = pickString(lot, ["condition", "vehicleCondition", "cond"]);

  const auctionDate = pickDate(lot, [
    "auctionDate",
    "auction_date",
    "auctionDateLocal",
    "auctionStartDate",
    "ad",
    "auctionDateTime",
  ]);

  let auctionTime = pickString(lot, [
    "auctionTime",
    "auction_time",
    "auctionTimeLocal",
    "auctionStartTime",
    "at",
  ]);

  if (!auctionTime && auctionDate) {
    auctionTime = auctionDate.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const saleStatus = pickString(lot, ["saleStatus", "sale_status", "status", "st"]);

  const image = normalizeImageUrl(
    pickString(lot, [
      "image",
      "imageUrl",
      "image_url",
      "primaryImageUrl",
      "images",
      "im",
      "piurl",
      "imageThumb",
    ])
  );

  const currentBid = toCents(currentBidValue ?? 0);

  return {
    lotNumber,
    title,
    brand: brand ?? null,
    model: model ?? null,
    year: year ? Math.round(year) : null,
    currentBid,
    location: location ?? null,
    image: image ?? null,
    description: buildDescription(lot),
    mileage: mileage ? Math.round(mileage) : null,
    fuel: fuel ?? null,
    transmission: transmission ?? null,
    color: color ?? null,
    condition: condition ?? null,
    auctionDate,
    auctionTime: auctionTime ?? null,
    saleStatus: saleStatus ?? null,
    featured: 0,
    active: 1,
  };
}
