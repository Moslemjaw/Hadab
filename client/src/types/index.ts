export interface Product {
  id: string;
  name: string;
  nameArabic?: string;
  price: number;
  originalPrice?: number;
  category: 'bags' | 'clothing' | 'accessories' | 'headwear' | 'pouches';
  image: string;
  textureImage: string;
  tag?: string;
  description: string;
  stitchDetail: string;
  yarnType: string;
  colorName: string;
  colorHex: string;
  isFeatured?: boolean;
  isSale?: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameArabic: string;
  description: string;
  count: number;
  image: string;
  accentBg: string;
  accentBorder: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
  pieceName: string;
  image: string;
}
