import axios from "axios";

import type { InsertVehicle } from "../../drizzle/schema";

function parsePositiveInteger(value: string | undefined): number | undefined {
  if (!value) return undefined;

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return undefined;
  }

  return parsed;
}

function parsePositiveIntegerOrFallback(
  value: string | undefined,
  fallback: number,
): number {
  return parsePositiveInteger(value) ?? fallback;
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

const DEFAULT_PAGE_SIZE = parsePositiveIntegerOrFallback(process.env.COPART_PAGE_SIZE, 100);
const DEFAULT_MAX_PAGES =
  parsePositiveIntegerOrFallback(process.env.COPART_MAX_PAGES, Number.POSITIVE_INFINITY);
const DEFAULT_APIFY_START_URL =
  "https://www.copart.com.br/search/leilão/?displayStr=Leilão&from=%2FvehicleFinder";
const APIFY_API_BASE = (process.env.APIFY_API_BASE ?? "https://api.apify.com/v2").replace(/\/+$/, "");
const APIFY_DATASET_PAGE_LIMIT = 1000;

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
    content?: CopartLot[];
    totalElements?: number;
  };
  results?: {
    content?: CopartLot[];
    totalElements?: number;
  };
  content?: CopartLot[];
  totalElements?: number;
}

interface CopartSearchResultPage {
  lots: CopartLot[];
  totalElements: number | null;
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

function sanitizePositiveInteger(maxItems?: number): number | undefined {
  if (typeof maxItems !== "number" || Number.isNaN(maxItems)) {
    return undefined;
  }

  const rounded = Math.floor(maxItems);
  if (!Number.isFinite(rounded) || rounded <= 0) {
    return undefined;
  }

  return rounded;
}

function extractSearchResult(response: CopartSearchResponse): CopartSearchResultPage {
  const nestedContent =
    response?.data?.results?.content ??
    response?.data?.content ??
    response?.results?.content ??
    response?.content ??
    [];

  const lots = Array.isArray(nestedContent) ? nestedContent : [];

  const totalCandidates = [
    response?.data?.results?.totalElements,
    response?.data?.totalElements,
    response?.results?.totalElements,
    response?.totalElements,
  ];

  const firstValidTotal = totalCandidates.find(
    (value): value is number => typeof value === "number" && Number.isFinite(value) && value >= 0,
  );

  return {
    lots,
    totalElements: typeof firstValidTotal === "number" ? firstValidTotal : null,
  };
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
  searchTerm: string = "",
): Promise<CopartSearchResultPage> {
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
      payload,
    );

    return extractSearchResult(response.data);
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
            },
          );

          return extractSearchResult(fallbackResponse.data);
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
  startUrl?: string;
}): Promise<CopartLot[]> {
  const apifyToken = process.env.APIFY_API_TOKEN?.trim();
  const apifyDatasetId = process.env.COPART_APIFY_DATASET_ID?.trim();
  const apifyActorId = process.env.COPART_APIFY_ACTOR_ID?.trim();
  const startUrl = options?.startUrl?.trim() || process.env.COPART_APIFY_START_URL?.trim() || DEFAULT_APIFY_START_URL;

  if (apifyToken && (apifyDatasetId || apifyActorId)) {
    try {
      const apifyLots = await fetchCopartInventoryFromApify({
        token: apifyToken,
        datasetId: apifyDatasetId ?? null,
        actorId: apifyActorId ?? null,
        startUrl,
        maxItems: options?.maxItems,
      });

      if (apifyLots.length > 0) {
        return apifyLots;
      }

      console.warn("[Copart] Nenhum lote retornado pelo Actor do Apify. Recuando para API pública.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha desconhecida";
      console.error(`[Copart] Falha ao obter inventário via Apify: ${message}. Aplicando fallback.`);
    }
  } else {
    if (!apifyToken) {
      console.warn(
        "[Copart] Token APIFY_API_TOKEN não configurado. Utilizando integração direta com a API pública da Copart.",
      );
    } else {
      console.warn(
        "[Copart] Identificador do Actor/Dataset da Apify não configurado. Utilizando API pública da Copart.",
      );
    }
  }

  return fetchCopartInventoryFromCopartApi({
    maxPages: options?.maxPages,
    pageSize: options?.pageSize,
    searchTerm: options?.searchTerm,
    maxItems: options?.maxItems,
  });
}

async function fetchCopartInventoryFromCopartApi(options?: {
  maxPages?: number;
  pageSize?: number;
  searchTerm?: string;
  maxItems?: number;
}): Promise<CopartLot[]> {
  const pageSize = Math.max(1, sanitizePositiveInteger(options?.pageSize) ?? DEFAULT_PAGE_SIZE);
  const maxPages = Math.max(1, sanitizePositiveInteger(options?.maxPages) ?? DEFAULT_MAX_PAGES);
  const searchTerm = options?.searchTerm?.trim() ?? "";
  const maxItems = sanitizePositiveInteger(options?.maxItems);

  const inventory: CopartLot[] = [];
  let totalElements: number | null = null;

  for (let page = 0; page < maxPages; page++) {
    const { lots, totalElements: pageTotal } = await fetchCopartSearchPage(
      page,
      pageSize,
      searchTerm,
    );

    if (pageTotal !== null && totalElements === null) {
      totalElements = pageTotal;
    }

    if (lots.length === 0) {
      break;
    }

    inventory.push(...lots);

    if (typeof maxItems === "number" && inventory.length >= maxItems) {
      return inventory.slice(0, maxItems);
    }

    if (lots.length < pageSize) {
      break;
    }

    if (typeof totalElements === "number" && inventory.length >= totalElements) {
      break;
    }
  }

  return typeof maxItems === "number" ? inventory.slice(0, maxItems) : inventory;
}

async function fetchCopartInventoryFromApify(options: {
  token: string;
  datasetId: string | null;
  actorId: string | null;
  startUrl: string;
  maxItems?: number;
}): Promise<CopartLot[]> {
  const maxItems = sanitizePositiveInteger(options.maxItems);

  if (options.datasetId) {
    return downloadApifyDataset(options.datasetId, options.token, maxItems);
  }

  if (!options.actorId) {
    throw new Error("Actor ID da Apify não informado");
  }

  const payload: Record<string, unknown> = {
    startUrl: options.startUrl,
  };

  if (typeof maxItems === "number") {
    payload.maxItems = maxItems;
  }

  const runResponse = await axios.post(
    `${APIFY_API_BASE}/acts/${options.actorId}/runs`,
    payload,
    {
      params: {
        token: options.token,
        waitForFinish: 120,
      },
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const runData = runResponse.data?.data;
  if (!runData) {
    throw new Error("Resposta inválida da Apify ao iniciar o Actor");
  }

  if (runData.status !== "SUCCEEDED") {
    const finalRun = await waitForApifyRunToFinish(runData.id, options.token);
    if (finalRun.status !== "SUCCEEDED") {
      throw new Error(`Actor terminou com status ${finalRun.status}`);
    }
    runData.defaultDatasetId = finalRun.defaultDatasetId;
  }

  const datasetId: string | undefined = runData.defaultDatasetId ?? runData.datasetId;
  if (!datasetId) {
    throw new Error("Actor não retornou um dataset padrão");
  }

  return downloadApifyDataset(datasetId, options.token, maxItems);
}

async function waitForApifyRunToFinish(runId: string, token: string) {
  const startedAt = Date.now();
  const timeout = 5 * 60 * 1000; // 5 minutos
  const pollingInterval = 5000;

  while (Date.now() - startedAt < timeout) {
    const response = await axios.get(`${APIFY_API_BASE}/actor-runs/${runId}`, {
      params: { token },
    });

    const data = response.data?.data;
    if (!data) {
      throw new Error("Resposta inválida ao consultar status do Actor");
    }

    if (["SUCCEEDED", "FAILED", "TIMED-OUT", "ABORTED"].includes(data.status)) {
      return data;
    }

    await new Promise(resolve => setTimeout(resolve, pollingInterval));
  }

  throw new Error("Tempo limite atingido aguardando finalização do Actor");
}

async function downloadApifyDataset(
  datasetId: string,
  token: string,
  maxItems?: number,
): Promise<CopartLot[]> {
  const items: CopartLot[] = [];
  let offset = 0;

  while (true) {
    const limit = Math.min(APIFY_DATASET_PAGE_LIMIT, maxItems ?? APIFY_DATASET_PAGE_LIMIT);
    const response = await axios.get<CopartLot[]>(`${APIFY_API_BASE}/datasets/${datasetId}/items`, {
      params: {
        token,
        clean: 1,
        format: "json",
        limit,
        offset,
      },
    });

    const chunk = Array.isArray(response.data) ? response.data : [];
    if (chunk.length === 0) {
      break;
    }

    items.push(...chunk);

    if (typeof maxItems === "number" && items.length >= maxItems) {
      break;
    }

    if (chunk.length < limit) {
      break;
    }

    offset += chunk.length;
  }

  return typeof maxItems === "number" ? items.slice(0, maxItems) : items;
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
