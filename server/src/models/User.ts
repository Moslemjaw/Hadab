import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: 'admin' | 'customer';
  authProvider?: 'local' | 'google' | 'apple';
  status: 'active' | 'vip' | 'new';
  isDisabled?: boolean;
  country?: string;
  rating?: number;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: false },
    phone: { type: String, default: '' },
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
    authProvider: { type: String, enum: ['local', 'google', 'apple'], default: 'local' },
    status: { type: String, enum: ['active', 'vip', 'new'], default: 'new' },
    isDisabled: { type: Boolean, default: false },
    country: { type: String, default: 'Kuwait' },
    rating: { type: Number, default: 5 },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastOrderDate: { type: String, default: 'Just joined' },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', UserSchema);
