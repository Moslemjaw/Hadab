import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// GET all customers (Admin only)
router.get('/', authenticateToken, requireAdmin, async (_req: Request, res: Response): Promise<void> => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(customers);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

export default router;
