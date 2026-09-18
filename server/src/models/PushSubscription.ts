import mongoose, { Document, Schema } from 'mongoose';

export interface IPushSubscription extends Document {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userId?: string;
  userEmail?: string;
  role: 'admin' | 'customer';
  device?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PushSubscriptionSchema = new Schema<IPushSubscription>(
  {
    endpoint: { type: String, required: true, unique: true, index: true },
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true },
    },
    userId: { type: String, default: null, index: true },
    userEmail: { type: String, default: null, index: true },
    role: { type: String, enum: ['admin', 'customer'], default: 'customer', index: true },
    device: { type: String, default: 'unknown' },
    userAgent: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export const PushSubscription = mongoose.model<IPushSubscription>(
  'PushSubscription',
  PushSubscriptionSchema
);
