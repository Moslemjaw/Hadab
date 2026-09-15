import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { Order } from '../models/Order';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// GET all customers (Admin only)
router.get('/', authenticateToken, requireAdmin, async (_req: Request, res: Response): Promise<void> => {
  try {
    const customers = await User.find({ role: { $ne: 'admin' } })
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    const orders = await Order.find().lean();

    const enriched = customers.map((c: any) => {
      const userOrders = orders.filter(
        (o: any) => o.customerEmail && c.email && o.customerEmail.toLowerCase() === c.email.toLowerCase()
      );
      const totalSpent = userOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
      const totalOrders = userOrders.length;
      const lastOrder = userOrders[userOrders.length - 1];
      const lastOrderDate = lastOrder?.createdAt
        ? new Date(lastOrder.createdAt).toLocaleDateString()
        : 'No orders';
      const status = totalSpent >= 200 ? 'vip' : totalOrders > 0 ? 'active' : 'new';

      return {
        ...c,
        id: c._id,
        totalOrders,
        totalSpent,
        lastOrderDate,
        status,
        rating: 5,
      };
    });

    res.json(enriched);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

export default router;
