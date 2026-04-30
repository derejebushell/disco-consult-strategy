export function formatCurrency(value: number): string {
  if (isNaN(value) || !isFinite(value)) return "$0";
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCurrencyShort(value: number): string {
  if (isNaN(value) || !isFinite(value)) return "$0";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}K`;
  return formatCurrency(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function parseMoney(value: string): number {
  if (!value) return 0;
  const cleaned = value.replace(/[$,\s]/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-AU").format(Math.round(value));
}
