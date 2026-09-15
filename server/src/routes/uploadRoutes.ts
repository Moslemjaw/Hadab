import { Router, Request, Response } from 'express';
import multer from 'multer';
import { cloudinary } from '../config/cloudinary';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// Upload image to Cloudinary (Admin only)
router.post('/upload', authenticateToken, requireAdmin, upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No image file provided' });
      return;
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'hadab_shop',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: error.message || 'Image upload failed' });
  }
});

export default router;
