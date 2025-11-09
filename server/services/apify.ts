import axios from 'axios';

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN;
const APIFY_BASE_URL = 'https://api.apify.com/v2';
const APIFY_DATASET_ID = 'x1Sv3284nZtfhMi9z'; // Dataset fixo com dados da Copart

interface ApifyRun {
  id: string;
  actId: string;
  status: 'SUCCEEDED' | 'RUNNING' | 'FAILED';
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
    console.error('Erro ao buscar runs do Apify:', error);
    throw new Error('Falha ao buscar execuções do Apify');
  }
}

/**
 * Busca a execução mais recente com status SUCCEEDED
 */
export async function getLatestSuccessfulRun(): Promise<ApifyRun | null> {
  const runs = await getApifyRuns();
  const successfulRun = runs.find(run => run.status === 'SUCCEEDED');
  return successfulRun || null;
}

/**
 * Busca os dados de veículos de um dataset específico
 */
export async function getDatasetItems(datasetId: string): Promise<ApifyVehicleData[]> {
  try {
    const response = await axios.get(`${APIFY_BASE_URL}/datasets/${datasetId}/items`, {
      params: {
        token: APIFY_API_TOKEN,
        format: 'json',
      },
    });

    return response.data || [];
  } catch (error) {
    console.error(`Erro ao buscar dados do dataset ${datasetId}:`, error);
    throw new Error('Falha ao buscar dados do dataset');
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
export function transformApifyVehicle(apifyVehicle: ApifyVehicleData) {
  return {
    lotNumber: apifyVehicle.lot_number,
    title: `${apifyVehicle.year} ${apifyVehicle.make} ${apifyVehicle.model}${apifyVehicle.trim ? ' ' + apifyVehicle.trim : ''}`,
    brand: apifyVehicle.make,
    model: apifyVehicle.model,
    year: apifyVehicle.year,
    currentBid: apifyVehicle.current_bid || 0,
    location: apifyVehicle.sale_location || `${apifyVehicle.location_city}, ${apifyVehicle.location_state}`,
    image: apifyVehicle.images && apifyVehicle.images.length > 0 ? apifyVehicle.images[0] : undefined,
    description: `${apifyVehicle.condition || ''} - ${apifyVehicle.primary_damage || 'No damage info'}`,
    mileage: apifyVehicle.odometer_reading || 0,
    fuel: apifyVehicle.fuel || 'Unknown',
    transmission: apifyVehicle.transmission || 'Unknown',
    color: apifyVehicle.color || 'Unknown',
    condition: apifyVehicle.condition || 'Unknown',
    featured: 0, // Pode ser ajustado com base em critérios
    // Campos adicionais que podem ser úteis
    vin: apifyVehicle.vin,
    engineType: apifyVehicle.engine_type,
    drive: apifyVehicle.drive,
    primaryDamage: apifyVehicle.primary_damage,
    titleCode: apifyVehicle.title_code,
    auctionDate: apifyVehicle.auction_date ? new Date(apifyVehicle.auction_date) : undefined,
    saleStatus: apifyVehicle.sale_status,
    estimatedValue: apifyVehicle.estimated_retail_value,
    buyNowPrice: apifyVehicle.buy_it_now_price,
    itemUrl: apifyVehicle.item_url,
    images: apifyVehicle.images,
  };
}
