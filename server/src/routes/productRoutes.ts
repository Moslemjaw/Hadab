import { Router, Request, Response } from 'express';
import { Product } from '../models/Product';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// GET all products (Public)
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, featured } = req.query;
    const filter: any = {};
    if (category && category !== 'all') {
      filter.category = category;
    }
    if (featured === 'true') {
      filter.isFeatured = true;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// GET single product by ID (Public)
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// CREATE new product (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to create product' });
  }
});

// UPDATE product (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to update product' });
  }
});

// DELETE product (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json({ message: 'Product deleted successfully', id: req.params.id });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

export default router;
