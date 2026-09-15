import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  descriptionAr: string;
  color: string;
  count: number;
  image: string;
  accentBg: string;
  accentBorder: string;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    nameAr: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    descriptionAr: { type: String, default: '' },
    color: { type: String, default: '#D9B99B' },
    count: { type: Number, default: 0 },
    image: { type: String, default: '/products/hadab-bag.jpg' },
    accentBg: { type: String, default: 'bg-blush-100/70' },
    accentBorder: { type: String, default: 'border-blush-300' },
  },
  {
    timestamps: true,
  }
);

export const Category = mongoose.model<ICategory>('Category', CategorySchema);
