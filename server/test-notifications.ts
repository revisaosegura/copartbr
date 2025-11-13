/**
 * Script para criar notificações de teste
 * Execute: node --loader tsx server/test-notifications.ts
 */

import { createNotification } from "./db";

async function createTestNotifications() {
  try {
    console.log("Criando notificações de teste...");

    // Notificação de novo lance
    await createNotification({
      userId: 1, // Substitua pelo ID de um usuário real
      type: "new_bid",
      title: "Novo Lance no seu Veículo Favorito!",
      message: "Alguém deu um lance de R$ 85.000,00 no BMW X3 2021",
      vehicleId: 1,
      read: 0,
    });

    // Notificação de mudança de preço
    await createNotification({
      userId: 1,
      type: "price_change",
      title: "Preço Reduzido!",
      message: "O preço do Toyota Corolla 2020 foi reduzido para R$ 68.900,00",
      vehicleId: 2,
      read: 0,
    });

    // Notificação de leilão próximo
    await createNotification({
      userId: 1,
      type: "auction_reminder",
      title: "Leilão Começando em Breve",
      message: "O leilão do Mercedes-Benz C180 começa em 1 hora!",
      vehicleId: 3,
      read: 0,
    });

    // Notificação de favorito atualizado
    await createNotification({
      userId: 1,
      type: "favorite_update",
      title: "Atualização no Veículo Favorito",
      message: "Novas fotos foram adicionadas ao Jeep Compass 2022",
      vehicleId: 4,
      read: 0,
    });

    // Notificação do sistema
    await createNotification({
      userId: 1,
      type: "system",
      title: "Bem-vindo à Copart Brasil!",
      message: "Explore nosso catálogo de veículos e participe dos leilões",
      read: 0,
    });

    console.log("✅ Notificações de teste criadas com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao criar notificações:", error);
  }
}

createTestNotifications();
