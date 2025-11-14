import axios from "axios";

import type { InsertVehicle } from "../../drizzle/schema";

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN;
const APIFY_BASE_URL = "https://api.apify.com/v2";
const APIFY_DATASET_ID = "x1Sv3284nZtfhMi9z"; // Dataset fixo com dados da Copart

interface ApifyRun {
  id: string;
  actId: string;
  status: "SUCCEEDED" | "RUNNING" | "FAILED";
  startedAt: string;
  finishedAt: string | null;
  defaultDatasetId: string;
}

interface ApifyVehicleData {
  lot_number: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  vin: string;
  engine_type?: string;
  transmission?: string;
  drive?: string;
  fuel?: string;
  color?: string;
  odometer?: string;
  odometer_reading?: number;
  primary_damage?: string;
  title_code?: string;
  sale_location?: string;
  auction_date?: number;
  auction_time?: string;
  sale_status?: string;
  estimated_retail_value?: number;
  current_bid?: number;
  buy_it_now_price?: number;
  currency?: string;
  images?: string[];
  item_url?: string;
  condition?: string;
  title_state?: string;
  title_type?: string;
  title_group_description?: string;
  keys?: string;
  location_city?: string;
  location_state?: string;
  location_country?: string;
  zip_code?: string;
}

/**
 * Busca a lista de execuções (runs) do Apify
 */
export async function getApifyRuns(): Promise<ApifyRun[]> {
  try {
    const response = await axios.get(`${APIFY_BASE_URL}/actor-runs`, {
      params: {
        token: APIFY_API_TOKEN,
        limit: 10,
        desc: true, // Mais recentes primeiro
      },
    });

    return response.data.data.items || [];
  } catch (error) {
    console.error("Erro ao buscar runs do Apify:", error);
    throw new Error("Falha ao buscar execuções do Apify");
  }
}

/**
 * Busca a execução mais recente com status SUCCEEDED
 */
export async function getLatestSuccessfulRun(): Promise<ApifyRun | null> {
  const runs = await getApifyRuns();
  const successfulRun = runs.find((run) => run.status === "SUCCEEDED");
  return successfulRun || null;
}

/**
 * Busca os dados de veículos de um dataset específico
 */
export async function getDatasetItems(
  datasetId: string
): Promise<ApifyVehicleData[]> {
  try {
    const response = await axios.get(
      `${APIFY_BASE_URL}/datasets/${datasetId}/items`,
      {
        params: {
          token: APIFY_API_TOKEN,
          format: "json",
        },
      }
    );

    return response.data || [];
  } catch (error) {
    console.error(`Erro ao buscar dados do dataset ${datasetId}:`, error);
    throw new Error("Falha ao buscar dados do dataset");
  }
}

/**
 * Busca os dados de veículos mais recentes disponíveis
 */
export async function getLatestVehicleData(): Promise<ApifyVehicleData[]> {
  console.log(`Buscando dados do dataset: ${APIFY_DATASET_ID}`);
  const vehicles = await getDatasetItems(APIFY_DATASET_ID);

  console.log(`${vehicles.length} veículos encontrados no Apify`);
  return vehicles;
}

/**
 * Transforma dados do Apify para o formato do banco de dados
 */
const parseInteger = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.round(value);
  }

  if (typeof value === "string") {
    const cleaned = value
      .replace(/[^0-9.,-]/g, "")
      .replace(/,/g, ".")
      .trim();
    if (cleaned.length === 0) {
      return null;
    }

    const numeric = Number.parseFloat(cleaned);
    if (!Number.isNaN(numeric) && Number.isFinite(numeric)) {
      return Math.round(numeric);
    }
  }

  return null;
};

const normalizeString = (value?: string | null): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const parseAuctionDate = (value: unknown): Date | null => {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const timestamp = value > 1_000_000_000_000 ? value : value * 1000;
    const date = new Date(timestamp);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === "string") {
    const normalized = value.trim();
    if (normalized.length === 0) {
      return null;
    }

    const numeric = Number(normalized);
    if (!Number.isNaN(numeric)) {
      return parseAuctionDate(numeric);
    }

    const parsed = new Date(normalized);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
};

export function transformApifyVehicle(
  apifyVehicle: ApifyVehicleData
): InsertVehicle {
  const currentBid = parseInteger(apifyVehicle.current_bid) ?? 0;
  const mileage =
    parseInteger(apifyVehicle.odometer_reading ?? apifyVehicle.odometer) ??
    undefined;
  const auctionDate = parseAuctionDate(apifyVehicle.auction_date);

  const locationCandidates = [
    normalizeString(apifyVehicle.sale_location),
    normalizeString(
      [apifyVehicle.location_city, apifyVehicle.location_state]
        .filter((part) => normalizeString(part) !== null)
        .join(", ")
    ),
  ];

  const location = locationCandidates.find(
    (value): value is string => typeof value === "string" && value.length > 0
  );

  const titleParts = [
    apifyVehicle.year,
    normalizeString(apifyVehicle.make),
    normalizeString(apifyVehicle.model),
    normalizeString(apifyVehicle.trim),
  ].filter((part) => part && String(part).length > 0);

  const title = titleParts.join(" ").trim();

  return {
    lotNumber: apifyVehicle.lot_number,
    title: title.length > 0 ? title : `Lote ${apifyVehicle.lot_number}`,
    brand: normalizeString(apifyVehicle.make),
    model: normalizeString(apifyVehicle.model),
    year: typeof apifyVehicle.year === "number" ? apifyVehicle.year : null,
    currentBid,
    location: location ?? null,
    image: normalizeString(apifyVehicle.images?.[0] ?? null),
    description:
      normalizeString(apifyVehicle.condition) ||
      normalizeString(apifyVehicle.primary_damage)
        ? [
            normalizeString(apifyVehicle.condition),
            normalizeString(apifyVehicle.primary_damage) ?? "No damage info",
          ]
            .filter((part): part is string => typeof part === "string")
            .join(" - ")
        : "No damage info",
    mileage: mileage ?? null,
    fuel: normalizeString(apifyVehicle.fuel),
    transmission: normalizeString(apifyVehicle.transmission),
    color: normalizeString(apifyVehicle.color),
    condition: normalizeString(apifyVehicle.condition),
    auctionDate: auctionDate ?? null,
    auctionTime: normalizeString(apifyVehicle.auction_time),
    saleStatus: normalizeString(apifyVehicle.sale_status),
    featured: 0,
    active: 1,
  };
}
