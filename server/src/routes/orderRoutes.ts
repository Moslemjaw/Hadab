import { Router, Request, Response } from 'express';
import { Order } from '../models/Order';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// GET all orders (Admin only)
router.get('/', authenticateToken, requireAdmin, async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// CREATE new order (Public checkout)
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const count = await Order.countDocuments();
    const orderNumber = `HDB-2026-${String(count + 101).padStart(3, '0')}`;

    const order = await Order.create({
      ...req.body,
      orderNumber,
      status: 'pending',
      statusArabic: 'قيد الانتظار',
    });

    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to place order' });
  }
});

// UPDATE order status (Admin only)
router.patch('/:id/status', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, statusArabic, artisan } = req.body;
    const updatePayload: any = {};
    if (status) updatePayload.status = status;
    if (statusArabic) updatePayload.statusArabic = statusArabic;
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
