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
        isDisabled: Boolean(c.isDisabled),
        rating: 5,
      };
    });

    res.json(enriched);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// TOGGLE DISABLE customer (Admin only)
router.patch('/:id/toggle-disable', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }
    if (user.role === 'admin' || user.email === 'byhadab@gmail.com') {
      res.status(400).json({ message: 'Cannot disable admin user' });
      return;
    }

    user.isDisabled = !user.isDisabled;
    await user.save();

    res.json({
      message: user.isDisabled ? 'Customer account disabled' : 'Customer account enabled',
      id: user._id,
      isDisabled: user.isDisabled,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// DELETE customer (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }
    if (user.role === 'admin' || user.email === 'byhadab@gmail.com') {
      res.status(400).json({ message: 'Cannot delete admin user' });
      return;
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Customer deleted successfully', id: req.params.id });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

export default router;
