export interface CountryShippingRate {
  countryCode: string; // e.g. 'KW', 'JO', 'SA', 'REST'
  countryName: string;
  countryNameAr: string;
  rate: number; // in baseCurrency
  enabled: boolean;
}

export interface ShippingConfig {
  enabled: boolean; // Master toggle: whether country-based shipping fee calculation is active
  rates: CountryShippingRate[];
  restOfWorldRate: number; // Fallback rate for countries not explicitly listed
}

export const DEFAULT_SHIPPING_CONFIG: ShippingConfig = {
  enabled: true,
  restOfWorldRate: 5, // 5 KWD (or base currency) for international / other countries
  rates: [
    { countryCode: 'KW', countryName: 'Kuwait', countryNameAr: 'الكويت', rate: 2, enabled: true },
    { countryCode: 'JO', countryName: 'Jordan', countryNameAr: 'الأردن', rate: 3, enabled: true },
    { countryCode: 'SA', countryName: 'Saudi Arabia', countryNameAr: 'المملكة العربية السعودية', rate: 4, enabled: true },
    { countryCode: 'AE', countryName: 'United Arab Emirates', countryNameAr: 'الإمارات العربية المتحدة', rate: 4, enabled: true },
    { countryCode: 'QA', countryName: 'Qatar', countryNameAr: 'قطر', rate: 4, enabled: true },
    { countryCode: 'BH', countryName: 'Bahrain', countryNameAr: 'البحرين', rate: 4, enabled: true },
    { countryCode: 'OM', countryName: 'Oman', countryNameAr: 'عُمان', rate: 4, enabled: true },
    { countryCode: 'REST', countryName: 'Other Countries', countryNameAr: 'باقي الدول', rate: 5, enabled: true },
  ],
};

export function getShippingFeeForCountry(
  countryCode: string,
  config: ShippingConfig = DEFAULT_SHIPPING_CONFIG
): number {
  if (!config.enabled) return 0;

  const match = config.rates.find(
    (r) => r.countryCode.toUpperCase() === countryCode.toUpperCase()
  );

  if (match) {
    return match.enabled ? match.rate : 0;
  }

  // Fallback to Rest of World rate if enabled
  const rest = config.rates.find((r) => r.countryCode === 'REST');
  if (rest) {
    return rest.enabled ? rest.rate : 0;
  }

  return config.restOfWorldRate ?? 5;
}
