import { db } from '../server/db.js';
import { vehicles } from '../drizzle/schema.js';
import { count } from 'drizzle-orm';

async function initDatabase() {
  try {
    console.log('🔍 Verificando se o banco de dados tem veículos...');
    
    // Verificar se há veículos no banco
    const result = await db.select({ count: count() }).from(vehicles);
    const vehicleCount = result[0]?.count || 0;
    
    console.log(`📊 Total de veículos no banco: ${vehicleCount}`);
    
    if (vehicleCount === 0) {
      console.log('⚠️  Banco de dados vazio! Executando sincronização inicial...');
      console.log('💡 Certifique-se de que APIFY_API_TOKEN está configurado nas variáveis de ambiente.');
      console.log('🔄 A sincronização será executada automaticamente pelo scheduler quando o servidor iniciar.');
      console.log('⏳ Aguarde alguns minutos para que os veículos sejam sincronizados.');
    } else {
      console.log('✅ Banco de dados já contém veículos. Sincronização inicial não necessária.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao verificar banco de dados:', error);
    console.log('⚠️  Continuando mesmo com erro...');
    process.exit(0); // Não falhar o deploy por causa disso
  }
}

initDatabase();
