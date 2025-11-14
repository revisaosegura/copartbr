import { fetchCopartInventory, transformCopartLot } from './copart';
import { getDb } from '../db';
import { vehicles, syncLogs } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

/**
 * Sincroniza veículos diretamente da Copart com o banco de dados
 */
export async function syncVehiclesFromCopart(): Promise<{
  success: boolean;
  vehiclesProcessed: number;
  vehiclesAdded: number;
  vehiclesUpdated: number;
  error?: string;
}> {
  const startTime = Date.now();
  let vehiclesProcessed = 0;
  let vehiclesAdded = 0;
  let vehiclesUpdated = 0;

  try {
    console.log('[Sync] Iniciando sincronização de veículos diretamente da Copart...');

    const copartLots = await fetchCopartInventory();
    console.log(`[Sync] ${copartLots.length} lotes retornados da Copart`);

    if (copartLots.length === 0) {
      console.warn('[Sync] Nenhum veículo encontrado na Copart');
      await logSync('warning', 0, 0, 0, 'Nenhum veículo encontrado na Copart');
      return {
        success: true,
        vehiclesProcessed: 0,
        vehiclesAdded: 0,
        vehiclesUpdated: 0,
      };
    }

    const db = await getDb();
    if (!db) {
      throw new Error('Database not available');
    }

    // Processar cada veículo
    for (const lot of copartLots) {
      try {
        vehiclesProcessed++;

        const vehicleData = transformCopartLot(lot);

        if (!vehicleData.lotNumber) {
          console.warn('[Sync] Veículo ignorado por não possuir lotNumber válido.');
          continue;
        }

        // Verificar se veículo já existe (por lotNumber)
        const existingVehicle = await db
          .select()
          .from(vehicles)
          .where(eq(vehicles.lotNumber, vehicleData.lotNumber))
          .limit(1);

        if (existingVehicle.length > 0) {
          // Atualizar veículo existente
          await db
            .update(vehicles)
            .set({
              ...vehicleData,
              updatedAt: new Date(),
            })
            .where(eq(vehicles.lotNumber, vehicleData.lotNumber));
          
          vehiclesUpdated++;
        } else {
          // Inserir novo veículo
          await db.insert(vehicles).values({
            ...vehicleData,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          
          vehiclesAdded++;
        }
      } catch (vehicleError) {
        const lotNumber = typeof lot?.lotNumber === 'string' ? lot.lotNumber : 'desconhecido';
        console.error(`[Sync] Erro ao processar veículo ${lotNumber}:`, vehicleError);
        // Continuar processando outros veículos mesmo se um falhar
      }
    }

    const duration = Date.now() - startTime;
    console.log(`[Sync] Sincronização concluída em ${duration}ms`);
    console.log(`[Sync] Processados: ${vehiclesProcessed}, Adicionados: ${vehiclesAdded}, Atualizados: ${vehiclesUpdated}`);

    // Registrar log de sincronização bem-sucedida
    await logSync('success', vehiclesProcessed, vehiclesAdded, vehiclesUpdated);

    return {
      success: true,
      vehiclesProcessed,
      vehiclesAdded,
      vehiclesUpdated,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('[Sync] Erro na sincronização:', error);

    // Registrar log de sincronização com erro
    await logSync('error', vehiclesProcessed, vehiclesAdded, vehiclesUpdated, errorMessage);

    return {
      success: false,
      vehiclesProcessed,
      vehiclesAdded,
      vehiclesUpdated,
      error: errorMessage,
    };
  }
}

/**
 * Registra um log de sincronização
 */
async function logSync(
  status: 'success' | 'error' | 'warning',
  vehiclesProcessed: number,
  vehiclesAdded: number,
  vehiclesUpdated: number,
  message?: string
) {
  try {
    const db = await getDb();
    if (!db) {
      throw new Error('Database not available');
    }
    await db.insert(syncLogs).values({
      type: 'vehicle_sync',
      status,
      vehiclesAffected: vehiclesProcessed,
      message: message || `Sincronização ${status}: ${vehiclesAdded} adicionados, ${vehiclesUpdated} atualizados`,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('[Sync] Erro ao registrar log:', error);
  }
}

/**
 * Executa sincronização inicial (se necessário)
 */
export async function runInitialSync() {
  try {
    const db = await getDb();
    if (!db) {
      throw new Error('Database not available');
    }
    
    // Verificar se já existem veículos no banco
    const vehicleCount = await db.select().from(vehicles).limit(1);
    
    if (vehicleCount.length === 0) {
      console.log('[Sync] Nenhum veículo no banco. Executando sincronização inicial...');
      await syncVehiclesFromCopart();
    } else {
      console.log('[Sync] Veículos já existem no banco. Sincronização inicial não necessária.');
    }
  } catch (error) {
    console.error('[Sync] Erro na sincronização inicial:', error);
  }
}
