import { FeeCalculation } from './types.ts';

export const PLATFORM_FEE_RATE = 0.05; // 5% platform handling fee

/**
 * Calculates the standard 5% platform handling fee and net business amount.
 * As required by section 20 of specification:
 * Example: ₹600 booking/order -> 5% platform handling fee = ₹30, net amount = ₹570.
 */
export function calculatePlatformFee(grossAmount: number): FeeCalculation {
  const safeGross = Math.max(0, Number(grossAmount) || 0);
  const platformFee = Math.round(safeGross * PLATFORM_FEE_RATE * 100) / 100;
  const netBusinessAmount = Math.round((safeGross - platformFee) * 100) / 100;

  return {
    grossAmount: safeGross,
    platformFeeRate: PLATFORM_FEE_RATE,
    platformFee,
    netBusinessAmount,
  };
}
