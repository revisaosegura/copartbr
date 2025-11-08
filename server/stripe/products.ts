/**
 * Stripe Products Configuration
 * Define all products and prices here for centralized management
 */

export const STRIPE_PRODUCTS = {
  // Depósito inicial para participar de leilões
  AUCTION_DEPOSIT: {
    name: "Depósito para Leilão",
    description: "Depósito inicial necessário para participar de leilões",
    prices: {
      STANDARD: {
        amount: 50000, // R$ 500,00 em centavos
        currency: "BRL",
        description: "Depósito padrão para leilões",
      },
      PREMIUM: {
        amount: 100000, // R$ 1.000,00 em centavos
        currency: "BRL",
        description: "Depósito premium para leilões de alto valor",
      },
    },
  },
  
  // Taxa de processamento de lance
  BID_FEE: {
    name: "Taxa de Lance",
    description: "Taxa administrativa para processar lance",
    prices: {
      STANDARD: {
        amount: 5000, // R$ 50,00 em centavos
        currency: "BRL",
        description: "Taxa padrão por lance",
      },
    },
  },
} as const;

/**
 * Fee configuration
 */
export const FEE_CONFIG = {
  // Taxa administrativa em porcentagem (5%)
  ADMIN_FEE_PERCENTAGE: 5,
  
  // Taxa fixa mínima em centavos (R$ 50,00)
  MIN_ADMIN_FEE: 5000,
  
  // Valor mínimo do depósito em centavos (R$ 500,00)
  MIN_DEPOSIT: 50000,
} as const;

/**
 * Helper function to format price for display
 */
export function formatPrice(amountInCents: number, currency: string = "BRL"): string {
  const amount = amountInCents / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

/**
 * Calculate total amount including fees
 */
export function calculateTotalWithFees(baseAmount: number, feeAmount: number = 0): number {
  return baseAmount + feeAmount;
}

/**
 * Calculate administrative fee based on amount
 * Returns the greater of: percentage-based fee or minimum fee
 */
export function calculateAdminFee(amount: number): number {
  const percentageFee = Math.floor((amount * FEE_CONFIG.ADMIN_FEE_PERCENTAGE) / 100);
  return Math.max(percentageFee, FEE_CONFIG.MIN_ADMIN_FEE);
}

/**
 * Calculate total amount with administrative fee
 */
export function calculateTotalWithAdminFee(baseAmount: number): number {
  const adminFee = calculateAdminFee(baseAmount);
  return baseAmount + adminFee;
}
