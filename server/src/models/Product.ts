import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  nameArabic?: string;
  price: number;
  originalPrice?: number;
  category: 'bags' | 'clothing' | 'accessories' | 'headwear' | 'pouches';
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
  isFeatured: boolean;
  isSale: boolean;
  stockCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    nameArabic: { type: String, default: '' },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    category: {
      type: String,
      enum: ['bags', 'clothing', 'accessories', 'headwear', 'pouches'],
      required: true,
      default: 'bags',
    },
    image: { type: String, default: '/products/hadab-bag.jpg' },
    textureImage: { type: String, default: '/products/hadab-bag.jpg' },
    tag: { type: String, default: 'New Drop' },
    tagArabic: { type: String, default: 'إصدار جديد' },
    description: { type: String, required: true },
    descriptionArabic: { type: String, default: '' },
    stitchDetail: { type: String, default: 'Hand-hooked continuous stitch' },
    stitchDetailArabic: { type: String, default: 'حياكة يدوية متصلة' },
    yarnType: { type: String, default: '100% Recycled Cotton Ribbon' },
    yarnTypeArabic: { type: String, default: 'خيط قطن معاد تدويره ١٠٠٪' },
    colorName: { type: String, default: 'Desert Oat' },
    colorNameArabic: { type: String, default: 'بيج صحراوي' },
    colorHex: { type: String, default: '#D6C7B2' },
    isFeatured: { type: Boolean, default: false },
    isSale: { type: Boolean, default: false },
    stockCount: { type: Number, default: 10 },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
