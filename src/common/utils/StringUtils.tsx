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

export function relativeTime(dateValue: Date) {
  const today = new Date();
  const targetDate = new Date(dateValue);
  
  const betweenTime = Math.floor((today.getTime() - targetDate.getTime()) / 1000 / 60);
  
  if (betweenTime < 1) {
    return '数秒前';
  }
  if (betweenTime < 60) {
    return `${betweenTime}分前`;
  }

  const betweenTimeHour = Math.floor(betweenTime / 60);
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour}時間前`;
  }

  const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
  if (betweenTimeDay < 31) {
    return `${betweenTimeDay}日前`;
  }

  const betweenTimeMonth = Math.floor(betweenTime / 60 / 24 / 30);
  if (betweenTimeMonth < 13) {
    return `${betweenTimeMonth}ヶ月前`;
  }

  return `${Math.floor(betweenTimeDay / 365)}年前`;
}