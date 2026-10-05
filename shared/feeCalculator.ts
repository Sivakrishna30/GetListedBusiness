import { FeeCalculation } from './types.ts';

export const PLATFORM_FEE_RATE = 0.02; // 2% platform handling fee

/**
 * Calculates the standard 2% platform handling fee and net business amount.
 * Example: ₹500 booking -> 2% platform handling fee = ₹10, net business amount = ₹490.
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
