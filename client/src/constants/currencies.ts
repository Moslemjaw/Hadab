export type CurrencyCode = 'KWD' | 'SAR' | 'AED' | 'BHD' | 'OMR' | 'QAR' | 'USD' | 'JOD' | 'GBP';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  symbolAr: string;
  name: string;
  nameAr: string;
  decimals: number;
  rateFromKWD: number; // 1 KWD = rateFromKWD * [Currency]
  flag: string;
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  KWD: {
    code: 'KWD',
    symbol: 'KD',
    symbolAr: 'د.ك',
    name: 'Kuwaiti Dinar',
    nameAr: 'دينار كويتي',
    decimals: 2,
    rateFromKWD: 1.0,
    flag: '🇰🇼',
  },
  SAR: {
    code: 'SAR',
    symbol: 'SAR',
    symbolAr: 'ر.س',
    name: 'Saudi Riyal',
    nameAr: 'ريال سعودي',
    decimals: 2,
    rateFromKWD: 12.23,
    flag: '🇸🇦',
  },
  AED: {
    code: 'AED',
    symbol: 'AED',
    symbolAr: 'د.إ',
    name: 'UAE Dirham',
    nameAr: 'درهم إماراتي',
    decimals: 2,
    rateFromKWD: 11.96,
    flag: '🇦🇪',
  },
  BHD: {
    code: 'BHD',
    symbol: 'BHD',
    symbolAr: 'د.ب',
    name: 'Bahraini Dinar',
    nameAr: 'دينار بحريني',
    decimals: 3,
    rateFromKWD: 1.23,
    flag: '🇧🇭',
  },
  OMR: {
    code: 'OMR',
    symbol: 'OMR',
    symbolAr: 'ر.ع',
    name: 'Omani Rial',
    nameAr: 'ريال عماني',
    decimals: 3,
    rateFromKWD: 1.25,
    flag: '🇴🇲',
  },
  QAR: {
    code: 'QAR',
    symbol: 'QAR',
    symbolAr: 'ر.ق',
    name: 'Qatari Riyal',
    nameAr: 'ريال قطري',
    decimals: 2,
    rateFromKWD: 11.87,
    flag: '🇶🇦',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    symbolAr: '$',
    name: 'US Dollar',
    nameAr: 'دولار أمريكي',
    decimals: 2,
    rateFromKWD: 3.26,
    flag: '🇺🇸',
  },
  JOD: {
    code: 'JOD',
    symbol: 'JOD',
    symbolAr: 'د.أ',
    name: 'Jordanian Dinar',
    nameAr: 'دينار أردني',
    decimals: 2,
    rateFromKWD: 2.31,
    flag: '🇯🇴',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    symbolAr: '£',
    name: 'British Pound',
    nameAr: 'جنيه إسترليني',
    decimals: 2,
    rateFromKWD: 2.56,
    flag: '🇬🇧',
  },
};

export const CURRENCY_LIST: CurrencyInfo[] = Object.values(SUPPORTED_CURRENCIES);

export function convertPrice(
  amount: number,
  fromCode: CurrencyCode = 'KWD',
  toCode: CurrencyCode = 'KWD'
): number {
  if (isNaN(amount) || amount === 0) return 0;
  if (fromCode === toCode) return amount;

  const fromRate = SUPPORTED_CURRENCIES[fromCode]?.rateFromKWD || 1.0;
  const toRate = SUPPORTED_CURRENCIES[toCode]?.rateFromKWD || 1.0;

  // Convert from origin to KWD, then to destination
  const inKWD = amount / fromRate;
  const converted = inKWD * toRate;

  const decimals = SUPPORTED_CURRENCIES[toCode]?.decimals ?? 2;
  return Number(converted.toFixed(decimals));
}

export function formatPriceValue(
  amount: number,
  currencyCode: CurrencyCode = 'KWD',
  isAr: boolean = false
): string {
  const info = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.KWD;
  const decimals = info.decimals;
  const formattedNumber = amount.toLocaleString(isAr ? 'ar-KW' : 'en-US', {
    minimumFractionDigits: decimals === 3 ? 3 : 0,
    maximumFractionDigits: decimals,
  });
  const symbol = isAr ? info.symbolAr : info.symbol;

  return isAr ? `${formattedNumber} ${symbol}` : `${symbol} ${formattedNumber}`;
}
