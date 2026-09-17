import { Router } from 'express';
import { Setting } from '../models/Setting';
import { authenticateToken, requireAdmin, type AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/settings - Public, fetch all settings as key-value pairs
router.get('/', async (_req, res) => {
  try {
    const settingsList = await Setting.find({});
    const settingsMap: Record<string, any> = {
      baseCurrency: 'KWD',
      freeShippingThreshold: 25,
      storeEmail: 'Byhadab@gmail.com',
    };

    settingsList.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    res.json(settingsMap);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
});

// PUT /api/settings - Admin only, update or bulk update settings
router.put('/', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const updates = req.body;
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    const results: Record<string, any> = {};
    for (const [key, value] of Object.entries(updates)) {
      const updated = await Setting.findOneAndUpdate(
        { key },
        { key, value },
        { upsert: true, new: true }
      );
      results[key] = updated.value;
    }

    res.json({ message: 'Settings updated successfully', settings: results });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Failed to update settings' });
  }
});

export default router;
