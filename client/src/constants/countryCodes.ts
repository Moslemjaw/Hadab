export interface CountryCode {
  code: string;
  name: string;
  nameAr: string;
  dialCode: string;
  flag: string;
  sample: string;
}

export const COUNTRY_CODES: CountryCode[] = [
  // GCC & Gulf Countries (Top priority)
  { code: 'KW', name: 'Kuwait', nameAr: 'الكويت', dialCode: '+965', flag: '🇰🇼', sample: '9999 8888' },
  { code: 'SA', name: 'Saudi Arabia', nameAr: 'المملكة العربية السعودية', dialCode: '+966', flag: '🇸🇦', sample: '50 123 4567' },
  { code: 'AE', name: 'United Arab Emirates', nameAr: 'الإمارات العربية المتحدة', dialCode: '+971', flag: '🇦🇪', sample: '50 123 4567' },
  { code: 'QA', name: 'Qatar', nameAr: 'قطر', dialCode: '+974', flag: '🇶🇦', sample: '3312 3456' },
  { code: 'BH', name: 'Bahrain', nameAr: 'البحرين', dialCode: '+973', flag: '🇧🇭', sample: '3612 3456' },
  { code: 'OM', name: 'Oman', nameAr: 'عُمان', dialCode: '+968', flag: '🇴🇲', sample: '9123 4567' },

  // Arab & Levant & North Africa
  { code: 'JO', name: 'Jordan', nameAr: 'الأردن', dialCode: '+962', flag: '🇯🇴', sample: '7 9123 4567' },
  { code: 'EG', name: 'Egypt', nameAr: 'مصر', dialCode: '+20', flag: '🇪🇬', sample: '100 123 4567' },
  { code: 'LB', name: 'Lebanon', nameAr: 'لبنان', dialCode: '+961', flag: '🇱🇧', sample: '70 123 456' },
  { code: 'IQ', name: 'Iraq', nameAr: 'العراق', dialCode: '+964', flag: '🇮🇶', sample: '790 123 4567' },
  { code: 'PS', name: 'Palestine', nameAr: 'فلسطين', dialCode: '+970', flag: '🇵🇸', sample: '59 123 4567' },
  { code: 'SY', name: 'Syria', nameAr: 'سوريا', dialCode: '+963', flag: '🇸🇾', sample: '944 123 456' },
  { code: 'YE', name: 'Yemen', nameAr: 'اليمن', dialCode: '+967', flag: '🇾🇪', sample: '771 234 567' },
  { code: 'MA', name: 'Morocco', nameAr: 'المغرب', dialCode: '+212', flag: '🇲🇦', sample: '612 345 678' },
  { code: 'DZ', name: 'Algeria', nameAr: 'الجزائر', dialCode: '+213', flag: '🇩🇿', sample: '551 234 567' },
  { code: 'TN', name: 'Tunisia', nameAr: 'تونس', dialCode: '+216', flag: '🇹🇳', sample: '20 123 456' },
  { code: 'LY', name: 'Libya', nameAr: 'ليبيا', dialCode: '+218', flag: '🇱🇾', sample: '91 234 5678' },
  { code: 'SD', name: 'Sudan', nameAr: 'السودان', dialCode: '+249', flag: '🇸🇩', sample: '91 234 5678' },

  // International - Americas
  { code: 'US', name: 'United States', nameAr: 'الولايات المتحدة', dialCode: '+1', flag: '🇺🇸', sample: '(555) 000-0000' },
  { code: 'CA', name: 'Canada', nameAr: 'كندا', dialCode: '+1', flag: '🇨🇦', sample: '(555) 000-0000' },
  { code: 'MX', name: 'Mexico', nameAr: 'المكسيك', dialCode: '+52', flag: '🇲🇽', sample: '55 1234 5678' },
  { code: 'BR', name: 'Brazil', nameAr: 'البرازيل', dialCode: '+55', flag: '🇧🇷', sample: '11 91234-5678' },

  // International - Europe
  { code: 'GB', name: 'United Kingdom', nameAr: 'المملكة المتحدة', dialCode: '+44', flag: '🇬🇧', sample: '7911 123456' },
  { code: 'TR', name: 'Turkey', nameAr: 'تركيا', dialCode: '+90', flag: '🇹🇷', sample: '532 123 4567' },
  { code: 'DE', name: 'Germany', nameAr: 'ألمانيا', dialCode: '+49', flag: '🇩🇪', sample: '151 23456789' },
  { code: 'FR', name: 'France', nameAr: 'فرنسا', dialCode: '+33', flag: '🇫🇷', sample: '6 12 34 56 78' },
  { code: 'IT', name: 'Italy', nameAr: 'إيطاليا', dialCode: '+39', flag: '🇮🇹', sample: '320 123 4567' },
  { code: 'ES', name: 'Spain', nameAr: 'إسبانيا', dialCode: '+34', flag: '🇪🇸', sample: '612 345 678' },
  { code: 'NL', name: 'Netherlands', nameAr: 'هولندا', dialCode: '+31', flag: '🇳🇱', sample: '6 12345678' },
  { code: 'CH', name: 'Switzerland', nameAr: 'سويسرا', dialCode: '+41', flag: '🇨🇭', sample: '78 123 45 67' },
  { code: 'SE', name: 'Sweden', nameAr: 'السويد', dialCode: '+46', flag: '🇸🇪', sample: '70 123 45 67' },
  { code: 'NO', name: 'Norway', nameAr: 'النرويج', dialCode: '+47', flag: '🇳🇴', sample: '412 34 567' },
  { code: 'DK', name: 'Denmark', nameAr: 'الدنمارك', dialCode: '+45', flag: '🇩🇰', sample: '20 12 34 56' },
  { code: 'BE', name: 'Belgium', nameAr: 'بلجيكا', dialCode: '+32', flag: '🇧🇪', sample: '470 12 34 56' },
  { code: 'AT', name: 'Austria', nameAr: 'النمسا', dialCode: '+43', flag: '🇦🇹', sample: '664 123456' },
  { code: 'IE', name: 'Ireland', nameAr: 'أيرلندا', dialCode: '+353', flag: '🇮🇪', sample: '83 123 4567' },
  { code: 'GR', name: 'Greece', nameAr: 'اليونان', dialCode: '+30', flag: '🇬🇷', sample: '691 234 5678' },
  { code: 'PT', name: 'Portugal', nameAr: 'البرتغال', dialCode: '+351', flag: '🇵🇹', sample: '912 345 678' },
  { code: 'CY', name: 'Cyprus', nameAr: 'قبرص', dialCode: '+357', flag: '🇨🇾', sample: '96 123456' },
  { code: 'RU', name: 'Russia', nameAr: 'روسيا', dialCode: '+7', flag: '🇷🇺', sample: '912 345-67-89' },

  // International - Asia & Oceania
  { code: 'IN', name: 'India', nameAr: 'الهند', dialCode: '+91', flag: '🇮🇳', sample: '98765 43210' },
  { code: 'PK', name: 'Pakistan', nameAr: 'باكستان', dialCode: '+92', flag: '🇵🇰', sample: '300 1234567' },
  { code: 'BD', name: 'Bangladesh', nameAr: 'بنغلاديش', dialCode: '+880', flag: '🇧🇩', sample: '1712-345678' },
  { code: 'PH', name: 'Philippines', nameAr: 'الفلبين', dialCode: '+63', flag: '🇵🇭', sample: '917 123 4567' },
  { code: 'ID', name: 'Indonesia', nameAr: 'إندونيسيا', dialCode: '+62', flag: '🇮🇩', sample: '812-3456-7890' },
  { code: 'MY', name: 'Malaysia', nameAr: 'ماليزيا', dialCode: '+60', flag: '🇲🇾', sample: '12-345 6789' },
  { code: 'SG', name: 'Singapore', nameAr: 'سنغافورة', dialCode: '+65', flag: '🇸🇬', sample: '8123 4567' },
  { code: 'TH', name: 'Thailand', nameAr: 'تايلاند', dialCode: '+66', flag: '🇹🇭', sample: '81 234 5678' },
  { code: 'JP', name: 'Japan', nameAr: 'اليابان', dialCode: '+81', flag: '🇯🇵', sample: '90-1234-5678' },
  { code: 'KR', name: 'South Korea', nameAr: 'كوريا الجنوبية', dialCode: '+82', flag: '🇰🇷', sample: '10-1234-5678' },
  { code: 'CN', name: 'China', nameAr: 'الصين', dialCode: '+86', flag: '🇨🇳', sample: '138 0013 8000' },
  { code: 'AU', name: 'Australia', nameAr: 'أستراليا', dialCode: '+61', flag: '🇦🇺', sample: '412 345 678' },
  { code: 'NZ', name: 'New Zealand', nameAr: 'نيوزيلندا', dialCode: '+64', flag: '🇳🇿', sample: '21 123 4567' },
  { code: 'ZA', name: 'South Africa', nameAr: 'جنوب أفريقيا', dialCode: '+27', flag: '🇿🇦', sample: '71 234 5678' },
];

export const DEFAULT_COUNTRY = COUNTRY_CODES[0]; // Kuwait 🇰🇼
