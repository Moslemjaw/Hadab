import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  type CurrencyCode,
  type CurrencyInfo,
  SUPPORTED_CURRENCIES,
  CURRENCY_LIST,
  convertPrice,
  formatPriceValue,
} from '../constants/currencies';
import {
  type ShippingConfig,
  DEFAULT_SHIPPING_CONFIG,
  getShippingFeeForCountry,
} from '../constants/shipping';
import { api } from '../services/api';

interface CurrencyContextType {
  baseCurrency: CurrencyCode;
  currency: CurrencyCode;
  currencyInfo: CurrencyInfo;
  supportedCurrencies: CurrencyInfo[];
  shippingConfig: ShippingConfig;
  setCurrency: (code: CurrencyCode) => void;
  setBaseCurrency: (code: CurrencyCode) => void;
  setShippingConfig: (config: ShippingConfig) => void;
  getShippingFee: (countryCode: string) => number;
  convert: (amountInBase: number) => number;
  format: (amountInBase: number, isAr?: boolean) => string;
  formatRaw: (amount: number, currencyCode?: CurrencyCode, isAr?: boolean) => string;
  getSymbol: (isAr?: boolean) => string;
  refreshSettings: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Base currency configured by admin (defaults to KWD)
  const [baseCurrency, setBaseCurrencyState] = useState<CurrencyCode>(() => {
    return (localStorage.getItem('hadab_base_currency') as CurrencyCode) || 'KWD';
  });

  // Display currency selected by the customer (defaults to baseCurrency or localStorage)
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('hadab_user_currency') as CurrencyCode;
    return saved && SUPPORTED_CURRENCIES[saved] ? saved : 'KWD';
  });

  // Shipping configuration from admin
  const [shippingConfig, setShippingConfigState] = useState<ShippingConfig>(() => {
    const saved = localStorage.getItem('hadab_shipping_config');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return DEFAULT_SHIPPING_CONFIG;
  });

  // Fetch initial base currency and shipping settings from backend
  const refreshSettings = async () => {
    try {
      const settings = await api.getSettings();
      if (settings?.baseCurrency && SUPPORTED_CURRENCIES[settings.baseCurrency as CurrencyCode]) {
        const adminBase = settings.baseCurrency as CurrencyCode;
        setBaseCurrencyState(adminBase);
        localStorage.setItem('hadab_base_currency', adminBase);

        // If user hasn't explicitly picked a display currency yet, match admin's base
        if (!localStorage.getItem('hadab_user_currency')) {
          setCurrencyState(adminBase);
        }
      }

      if (settings?.shippingConfig) {
        setShippingConfigState(settings.shippingConfig);
        localStorage.setItem('hadab_shipping_config', JSON.stringify(settings.shippingConfig));
      }
    } catch (e) {
      console.error('Failed to load currency/shipping settings:', e);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    if (SUPPORTED_CURRENCIES[code]) {
      setCurrencyState(code);
      localStorage.setItem('hadab_user_currency', code);
    }
  };

  const setBaseCurrency = (code: CurrencyCode) => {
    if (SUPPORTED_CURRENCIES[code]) {
      setBaseCurrencyState(code);
      localStorage.setItem('hadab_base_currency', code);
    }
  };

  const setShippingConfig = (config: ShippingConfig) => {
    setShippingConfigState(config);
    localStorage.setItem('hadab_shipping_config', JSON.stringify(config));
  };

  const getShippingFee = (countryCode: string): number => {
    return getShippingFeeForCountry(countryCode, shippingConfig);
  };

  // Convert an amount from admin's base currency to customer's active display currency
  const convert = (amountInBase: number): number => {
    return convertPrice(amountInBase, baseCurrency, currency);
  };

  // Format an amount (given in base currency) converted to active display currency
  const format = (amountInBase: number, isAr: boolean = false): string => {
    const converted = convert(amountInBase);
    return formatPriceValue(converted, currency, isAr);
  };

  // Format any raw number directly in a chosen currency
  const formatRaw = (amount: number, targetCode?: CurrencyCode, isAr: boolean = false): string => {
    return formatPriceValue(amount, targetCode || currency, isAr);
  };

  const getSymbol = (isAr: boolean = false): string => {
    const info = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.KWD;
    return isAr ? info.symbolAr : info.symbol;
  };

  const currencyInfo = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.KWD;

  return (
    <CurrencyContext.Provider
      value={{
        baseCurrency,
        currency,
        currencyInfo,
        supportedCurrencies: CURRENCY_LIST,
        shippingConfig,
        setCurrency,
        setBaseCurrency,
        setShippingConfig,
        getShippingFee,
        convert,
        format,
        formatRaw,
        getSymbol,
        refreshSettings,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
