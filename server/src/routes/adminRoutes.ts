import { Router, Request, Response } from 'express';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { Category } from '../models/Category';
import { User } from '../models/User';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// DELETE erase all data (Admin only)
router.delete('/erase-all', authenticateToken, requireAdmin, async (_req: Request, res: Response): Promise<void> => {
  try {
    const [products, orders, categories, customers] = await Promise.all([
      Product.deleteMany({}),
      Order.deleteMany({}),
      Category.deleteMany({}),
      User.deleteMany({ role: { $ne: 'admin' } }),
    ]);

    res.json({
      message: 'All data erased successfully',
      deleted: {
        products: products.deletedCount,
        orders: orders.deletedCount,
        categories: categories.deletedCount,
        customers: customers.deletedCount,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to erase data' });
  }
});

export default router;
