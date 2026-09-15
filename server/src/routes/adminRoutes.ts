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
    const [products, orders, customers] = await Promise.all([
      Product.deleteMany({}),
      Order.deleteMany({}),
      User.deleteMany({
        $and: [
          { role: { $ne: 'admin' } },
          { email: { $ne: 'byhadab@gmail.com' } },
        ],
      }),
    ]);

    res.json({
      message: 'Data erased successfully (categories and admin account preserved)',
      deleted: {
        products: products.deletedCount,
        orders: orders.deletedCount,
        categories: 0,
        customers: customers.deletedCount,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to erase data' });
  }
});

export default router;
