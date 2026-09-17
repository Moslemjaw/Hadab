export interface ColorVariant {
  name: string;
  nameArabic?: string;
  colorHex?: string;
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  nameArabic?: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  textureImage: string;
  images?: string[];
  tag?: string;
  tagArabic?: string;
  description: string;
  descriptionArabic?: string;
  stitchDetail: string;
  stitchDetailArabic?: string;
  yarnType: string;
  yarnTypeArabic?: string;
  colorName: string;
  colorNameArabic?: string;
  colorHex: string;
  colors?: string[];
  sizes?: string[];
  colorVariants?: ColorVariant[];
  selectedColor?: string;
  selectedSize?: string;
  discount?: number;
  isFeatured?: boolean;
  isSale?: boolean;
  stockCount?: number;
}

export interface Category {
  id: string;
  slug?: string;
  name: string;
  nameArabic: string;
  description: string;
  descriptionArabic?: string;
  count: number;
  image: string;
  accentBg: string;
  accentBorder: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  quoteArabic?: string;
  author: string;
  authorArabic?: string;
  location: string;
  locationArabic?: string;
  pieceName: string;
  pieceNameArabic?: string;
  image: string;
}
