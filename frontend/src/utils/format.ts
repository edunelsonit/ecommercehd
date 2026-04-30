export function formatMoney(value: string | number | null | undefined): string {
  const amount = Number(value || 0)

  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function compactId(value: string | number | undefined): string {
  if (value === undefined) return '-'
  const text = String(value)
  return text.length > 8 ? `${text.slice(0, 4)}...${text.slice(-4)}` : text
}
