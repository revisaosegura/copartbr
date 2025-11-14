import axios from "axios";

import type { InsertVehicle } from "../../drizzle/schema";

const COPART_SEARCH_URL =
  process.env.COPART_SEARCH_URL ?? "https://www.copart.com.br/public/data/lots/search";
const COPART_SEARCH_FALLBACK_URL =
  process.env.COPART_SEARCH_FALLBACK_URL ??
  "https://www.copart.com.br/public/data/lots/search-results";
const DEFAULT_PAGE_SIZE = Number.parseInt(process.env.COPART_PAGE_SIZE ?? "100", 10);
const DEFAULT_MAX_PAGES = Number.parseInt(process.env.COPART_MAX_PAGES ?? "5", 10);

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

function normalizeCurrencyUnit(unit: string | null | undefined): "cents" | "reais" | null {
  if (!unit) return null;

  const normalized = unit
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .trim();

  if (
    [
      "cent",
      "cents",
      "centavo",
      "centavos",
      "centavosbr",
      "centavosbrl",
      "brlcentavo",
      "brlcentavos",
      "brlcent",
      "brlcents",
    ].includes(normalized)
  ) {
    return "cents";
  }

  if (["brl", "real", "reais", "rs"].includes(normalized)) {
    return "reais";
  }

  return null;
}

function toCents(
  value: number | null,
  ...unitHints: Array<string | null | undefined>
): number {
  if (value === null || Number.isNaN(value)) {
    return 0;
  }

  const absolute = Math.abs(value);

  if (absolute === 0) {
    return 0;
  }

  const normalizedUnits = unitHints
    .map((hint) => normalizeCurrencyUnit(hint))
    .filter((unit): unit is "cents" | "reais" => unit !== null);

  if (normalizedUnits.includes("cents")) {
    return Math.round(value);
  }

  // Por padrão assumimos que os valores da Copart estão em reais (BRL)
  if (normalizedUnits.includes("reais")) {
    return Math.round(value * 100);
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

  const currentBidCurrency = pickString(lot, [
    "currentBidCurrency",
    "currentBidCurrencyCode",
    "currency",
    "currencyCode",
    "currency_code",
  ]);

  const currentBidUnit = pickString(lot, [
    "currentBidUnit",
    "current_bid_unit",
    "cu",
  ]);

  const currentBidAmountUnit = pickString(lot, [
    "currentBidAmountUnit",
  ]);

  const currentBidAmountType = pickString(lot, [
    "currentBidAmountType",
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

  const currentBid = toCents(
    currentBidValue ?? 0,
    currentBidCurrency,
    currentBidUnit,
    currentBidAmountUnit,
    currentBidAmountType,
  );

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
