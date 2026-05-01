/**
 * Formats a numeric value into Naira (₦) currency.
 * Optimized for Nigerian e-commerce standards.
 */
export function formatMoney(
  value: string | number | null | undefined,
  includeDecimals: boolean = false
): string {
  // Convert to number, defaulting to 0 if null/undefined/NaN
  const amount = Number(value) || 0;

  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    // In Nigeria, we often hide kobo (decimals) for large amounts, 
    // but keep them for precise wallet transactions.
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(amount);
}

/**
 * Shortens long IDs or Hashes (like UUIDs or Transaction References).
 * Example: "550e8400-e29b-41d4-a716-446655440000" -> "550e...0000"
 */
export function compactId(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '-';
  
  const text = String(value);
  // If it's a standard short ID (like your autoincrement Ints), return as is.
  // If it's a UUID or Nin/Reference, truncate it.
  return text.length > 10 
    ? `${text.slice(0, 4)}...${text.slice(-4)}` 
    : text;
}

/**
 * Formats dates for the Nigerian locale (DD/MM/YYYY)
 * Useful for your createdAt fields.
 */
export function formatDate(date: string | Date | undefined): string {
  if (!date) return '-';
  return new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'medium',
  }).format(new Date(date));
}