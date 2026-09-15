export interface Product {
  id: string;
  name: string;
  nameArabic?: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  textureImage: string;
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
  discount?: number;
  isFeatured?: boolean;
  isSale?: boolean;
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
