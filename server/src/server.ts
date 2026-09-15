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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB();

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

app.listen(PORT, () => {
  console.log(`[HADAB Backend] Handmade Shop Server running on port ${PORT}`);
});
