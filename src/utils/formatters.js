import { CURRENCIES } from './defaults';

export function formatCurrency(amount, currencyCode = 'EUR', compact = false) {
  const num = Number(amount) || 0;
  const curr = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];

  if (compact && Math.abs(num) >= 1_000_000) {
    const millions = (num / 1_000_000).toFixed(2);
    return curr.position === 'before'
      ? `${curr.symbol}${millions}M`
      : `${millions}M ${curr.symbol}`;
  }

  if (compact && Math.abs(num) >= 10_000) {
    const thousands = (num / 1_000).toFixed(0);
    return curr.position === 'before'
      ? `${curr.symbol}${thousands}k`
      : `${thousands}k ${curr.symbol}`;
  }

  const formatted = Math.round(num).toLocaleString('en-US');
  return curr.position === 'before'
    ? `${curr.symbol}${formatted}`
    : `${formatted} ${curr.symbol}`;
}

export function formatPercent(rate, decimals = 1) {
  const num = Number(rate) || 0;
  return `${num.toFixed(decimals)}%`;
}

export function formatNumber(val, decimals = 0) {
  const num = Number(val) || 0;
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
