export const formatCurrency = (fee: number, currency = ''): string =>
  Intl.NumberFormat().format(fee).replaceAll(',', "'") + currency;
