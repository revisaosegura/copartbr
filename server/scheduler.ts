import cron from 'node-cron';
import { syncVehiclesFromCopart, runInitialSync } from './services/vehicleSync';

/**
 * Configura o cron job para sincronização automática de veículos
 * Executa a cada 4 horas
 */
export function setupVehicleSyncScheduler() {
  // Executar sincronização inicial ao iniciar o servidor
  console.log('[Scheduler] Executando sincronização inicial...');
  runInitialSync().catch(error => {
    console.error('[Scheduler] Erro na sincronização inicial:', error);
  });

  // Agendar sincronização a cada 4 horas
  // Formato cron: "minuto hora dia mês dia-da-semana"
  // "0 */4 * * *" = A cada 4 horas, no minuto 0
  const cronExpression = '0 */4 * * *';
  
  console.log(`[Scheduler] Agendando sincronização automática: ${cronExpression} (a cada 4 horas)`);
  
  cron.schedule(cronExpression, async () => {
    console.log('[Scheduler] Iniciando sincronização agendada...');
    try {
      const result = await syncVehiclesFromCopart();
      if (result.success) {
        console.log(`[Scheduler] Sincronização concluída: ${result.vehiclesProcessed} processados, ${result.vehiclesAdded} adicionados, ${result.vehiclesUpdated} atualizados`);
      } else {
        console.error(`[Scheduler] Sincronização falhou: ${result.error}`);
      }
    } catch (error) {
      console.error('[Scheduler] Erro na sincronização agendada:', error);
    }
  }, {
    timezone: 'America/Sao_Paulo' // Timezone do Brasil
  });

  console.log('[Scheduler] Scheduler configurado com sucesso');
}

/**
 * Para teste: executa sincronização imediatamente
 */
export async function runSyncNow() {
  console.log('[Scheduler] Executando sincronização manual...');
  try {
    const result = await syncVehiclesFromCopart();
    console.log('[Scheduler] Resultado:', result);
    return result;
  } catch (error) {
    console.error('[Scheduler] Erro na sincronização manual:', error);
    throw error;
  }
}
