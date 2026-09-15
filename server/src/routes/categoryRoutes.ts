import { Router, Request, Response } from 'express';
import { Category } from '../models/Category';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// GET all categories (Public)
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// CREATE category (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to create category' });
  }
});

// UPDATE category (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to update category' });
  }
});

// DELETE category (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.json({ message: 'Category deleted successfully', id: req.params.id });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

export default router;
