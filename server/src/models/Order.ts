import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem extends Document {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  destination: 'Jordan' | 'Kuwait' | 'UAE' | 'Saudi Arabia';
  destinationArabic: string;
  items: {
    productId?: string;
    name: string;
    nameArabic?: string;
    price: number;
    image: string;
    quantity: number;
  }[];
  total: number;
  address?: string;
  notes?: string;
  status: 'unpaid' | 'contacting' | 'paid' | 'pending' | 'hooking' | 'finishing' | 'shipped' | 'delivered';
  statusArabic: string;
  paymentStatus?: 'unpaid' | 'contacting' | 'paid';
  paymentStatusArabic?: string;
  artisan: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrderItem>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, default: '' },
    address: { type: String, default: '' },
    notes: { type: String, default: '' },
    destination: {
      type: String,
      enum: ['Jordan', 'Kuwait', 'UAE', 'Saudi Arabia'],
      default: 'Kuwait',
    },
    destinationArabic: { type: String, default: 'الكويت' },
    items: [
      {
        productId: { type: String },
        name: { type: String, required: true },
        nameArabic: { type: String },
        price: { type: Number, required: true },
        image: { type: String, default: '/products/hadab-bag.jpg' },
        quantity: { type: Number, default: 1 },
      },
    ],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['unpaid', 'contacting', 'paid', 'pending', 'hooking', 'finishing', 'shipped', 'delivered'],
      default: 'unpaid',
    },
    statusArabic: { type: String, default: 'غير مدفوع' },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'contacting', 'paid'],
      default: 'unpaid',
    },
    paymentStatusArabic: { type: String, default: 'غير مدفوع' },
    artisan: { type: String, default: 'Hadab Team (Amman)' },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model<IOrderItem>('Order', OrderSchema);
