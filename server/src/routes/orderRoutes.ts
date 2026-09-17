import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Order } from '../models/Order';
import { User } from '../models/User';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// GET customer's own order history
router.get('/my-orders', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userEmail = req.user?.email;
    const userId = req.user?.id;
    if (!userEmail && !userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const queryConditions: any[] = [];

    if (userId) {
      queryConditions.push({ userId });
    }

    if (userEmail) {
      queryConditions.push(
        { customerEmail: { $regex: new RegExp(`^${userEmail.trim()}$`, 'i') } }
      );
    }

    // If user has a phone number registered, also match orders placed with that phone
    if (userId) {
      try {
        const userDoc = await User.findById(userId);
        if (userDoc?.phone) {
          const rawPhone = userDoc.phone.trim();
          const digits = rawPhone.replace(/[^0-9]/g, '');
          queryConditions.push({ customerPhone: rawPhone });
          if (digits.length >= 7) {
            queryConditions.push({ customerPhone: { $regex: digits.slice(-7) } });
          }
        }
      } catch {}
    }

    const orders = queryConditions.length > 0
      ? await Order.find({ $or: queryConditions }).sort({ createdAt: -1 })
      : [];

    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// GET all orders (Admin only)
router.get('/', authenticateToken, requireAdmin, async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// CREATE new order (Public checkout & Logged-in customers)
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if token was provided in header
    let authUserId: string | null = null;
    let authUserEmail: string | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'hadab-secret-key-2026');
        authUserId = decoded.id;
        authUserEmail = decoded.email;
      } catch {}
    }

    // Generate guaranteed collision-free order number
    const count = await Order.countDocuments();
    let num = count + 101;
    let orderNumber = `HDB-2026-${String(num).padStart(3, '0')}`;
    while (await Order.exists({ orderNumber })) {
      num += 1;
      orderNumber = `HDB-2026-${String(num).padStart(3, '0')}`;
    }

    const resolvedUserId = req.body.userId || authUserId || null;
    const resolvedEmail = req.body.customerEmail || authUserEmail || '';

    const order = await Order.create({
      ...req.body,
      userId: resolvedUserId,
      customerEmail: resolvedEmail,
      orderNumber,
      status: req.body.status || 'pending',
      statusArabic: req.body.statusArabic || 'قيد الانتظار',
      paymentStatus: req.body.paymentStatus || 'unpaid',
      paymentStatusArabic: req.body.paymentStatusArabic || 'غير مدفوع',
    });

    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to place order' });
  }
});

// UPDATE order status (Admin only)
router.patch('/:id/status', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, statusArabic, paymentStatus, paymentStatusArabic, artisan } = req.body;
    const updatePayload: any = {};
    if (status) updatePayload.status = status;
    if (statusArabic) updatePayload.statusArabic = statusArabic;
    if (paymentStatus) updatePayload.paymentStatus = paymentStatus;
    if (paymentStatusArabic) updatePayload.paymentStatusArabic = paymentStatusArabic;
    if (artisan) updatePayload.artisan = artisan;

    const updated = await Order.findByIdAndUpdate(req.params.id, updatePayload, { new: true });
    if (!updated) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to update order status' });
  }
});

export default router;
