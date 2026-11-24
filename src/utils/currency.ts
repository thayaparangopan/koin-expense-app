import { ReceiptItem } from '../types/expense';

/**
 * Formats an integer amount in cents to a human-readable currency string in Sri Lankan Rupees.
 * Example: 2850 -> "Rs. 28.50"
 */
export function formatCents(cents: number): string {
  const isNegative = cents < 0;
  const abs = Math.abs(cents);
  const rupees = Math.floor(abs / 100);
  const remainder = abs % 100;
  const paddedRemainder = remainder.toString().padStart(2, '0');
  return `${isNegative ? '-' : ''}Rs. ${rupees}.${paddedRemainder}`;
}

/**
 * Converts integer cents to input string without currency symbol.
 * Example: 2850 -> "28.50"
 */
export function centsToInputString(cents: number): string {
  if (cents === 0) return '0.00';
  const dollars = Math.floor(cents / 100);
  const remainder = cents % 100;
  return `${dollars}.${remainder.toString().padStart(2, '0')}`;
}

/**
 * Parses user text input string into integer cents.
 * Handles decimals, trims whitespace, prevents NaN.
 * Example: "14.50" -> 1450, "14" -> 1400, "14.5" -> 1450
 */
export function parseInputToCents(input: string): number {
  if (!input) return 0;
  // Remove any currency symbols, commas or extra characters
  const clean = input.replace(/[^0-9.]/g, '').trim();
  if (!clean) return 0;

  const parts = clean.split('.');
  const dollars = parseInt(parts[0] || '0', 10);
  let cents = 0;
  if (parts.length > 1) {
    const rawCents = (parts[1] + '00').slice(0, 2);
    cents = parseInt(rawCents, 10);
  }

  return Math.max(0, dollars * 100 + cents);
}

/**
 * Sums all item prices using integer arithmetic to prevent floating point inaccuracies.
 */
export function calculateTotalCents(items: ReceiptItem[]): number {
  return items.reduce((sum, item) => sum + (item.priceCents || 0), 0);
}
