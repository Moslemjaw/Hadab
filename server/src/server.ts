import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import orderRoutes from './routes/orderRoutes';
import customerRoutes from './routes/customerRoutes';
import uploadRoutes from './routes/uploadRoutes';
import adminRoutes from './routes/adminRoutes';
import settingsRoutes from './routes/settingsRoutes';
import notificationRoutes from './routes/notificationRoutes';

import { User } from './models/User';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas and ensure Admin account is ready
connectDB().then(async () => {
  try {
    const adminEmail = 'byhadab@gmail.com';
    const existing = await User.findOne({ email: adminEmail });
    if (!existing) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Byhadab2026@', salt);
      await User.create({
        name: 'HADAB Admin',
        email: adminEmail,
        password: hashedPassword,
        phone: '+965 9900 0000',
        role: 'admin',
        status: 'vip',
        country: 'Kuwait',
      });
      console.log('[HADAB Backend] Admin account initialized: byhadab@gmail.com');
    } else if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
      console.log('[HADAB Backend] Admin account role confirmed: byhadab@gmail.com');
    }
  } catch (err) {
    console.error('[HADAB Backend] Admin verification check notice:', err);
  }
});

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());

// API Health Check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', shop: 'HADAB Handmade Shop API', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/notifications', notificationRoutes);

app.listen(PORT, () => {
  console.log(`[HADAB Backend] Handmade Shop Server running on port ${PORT}`);
});
