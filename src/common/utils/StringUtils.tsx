export function createState(len: number) {
  let characters = '0123456789abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < len; i++) {
    let randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

export function currency(num: number): string {
  return '¥' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function calcDiscountRate(price: number, priceSale: number): string | undefined {
  if (priceSale !== undefined && priceSale < price) {
    const discountRate = ((price - priceSale) / price) * 100;
    const roundedDiscountRate = Math.round(discountRate);
    return roundedDiscountRate.toString() + '% ';
  }
  return undefined;
}

export function dateToString(date: Date): string {
  const formatDate = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatDate.format(date);
}