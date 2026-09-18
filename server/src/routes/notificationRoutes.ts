import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PushSubscription } from '../models/PushSubscription';
import {
  getVapidPublicKey,
  sendPushNotification,
  sendPushToRole,
} from '../config/webPush';

const router = Router();

// GET VAPID public key
router.get('/vapid-key', (_req: Request, res: Response) => {
  res.json({ publicKey: getVapidPublicKey() });
});

// SUBSCRIBE device
router.post('/subscribe', async (req: Request, res: Response): Promise<void> => {
  try {
    const { subscription, role = 'customer', device = 'unknown', userAgent = '' } = req.body;

    if (!subscription || !subscription.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
      res.status(400).json({ message: 'Invalid subscription object' });
      return;
    }

    // Optional auth token check
    let userId: string | null = null;
    let userEmail: string | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'hadab_super_secret_jwt_key_2026');
        userId = decoded.id;
        userEmail = decoded.email ? decoded.email.toLowerCase().trim() : null;
      } catch {}
    }

    const resolvedEmail = (userEmail || req.body.userEmail || req.body.email || '').toLowerCase().trim() || null;

    // Upsert subscription
    const existing = await PushSubscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      {
        keys: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
        userId: userId || req.body.userId || null,
        userEmail: resolvedEmail,
        role: role === 'admin' ? 'admin' : 'customer',
        device,
        userAgent,
      },
      { upsert: true, new: true }
    );

    console.log(`[WebPush] Subscribed device (${device}, role: ${role}) - ${subscription.endpoint.slice(-20)}`);

    res.status(201).json({
      success: true,
      message: 'Subscription saved successfully',
      subscriptionId: existing._id,
    });
  } catch (error: any) {
    console.error('[WebPush] Subscribe error:', error);
    res.status(500).json({ message: error.message || 'Failed to save subscription' });
  }
});

// UNSUBSCRIBE device
router.post('/unsubscribe', async (req: Request, res: Response): Promise<void> => {
  try {
    const { endpoint } = req.body;
    if (!endpoint) {
      res.status(400).json({ message: 'Endpoint is required' });
      return;
    }

    await PushSubscription.deleteOne({ endpoint });
    res.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to unsubscribe' });
  }
});

// TEST push notification (sends to current subscription or admin role)
router.post('/test', async (req: Request, res: Response): Promise<void> => {
  try {
    const { subscription } = req.body;

    const testPayload = {
      title: 'هَدَب | HADAB — Push Alert',
      body: '🎉 iPhone Web Push is working seamlessly! You will receive instant order notifications.',
      icon: '/apple-touch-icon.png',
      badge: '/apple-touch-icon.png',
      url: '/#admin',
      tag: 'hadab-test',
    };

    if (subscription && subscription.endpoint) {
      const result = await sendPushNotification(subscription, testPayload);
      if (result.success) {
        res.json({ success: true, message: 'Test notification sent to device' });
        return;
      } else {
        res.status(500).json({ success: false, message: result.error || 'Failed to send' });
        return;
      }
    }

    // Otherwise send to all admins
    const roleResult = await sendPushToRole('admin', testPayload);
    res.json({
      success: true,
      message: `Test notification sent to ${roleResult.sent} admin device(s)`,
      stats: roleResult,
    });
  } catch (error: any) {
    console.error('[WebPush] Test notification error:', error);
    res.status(500).json({ message: error.message || 'Failed to send test push' });
  }
});

// GET stats on subscriptions (Admin)
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const total = await PushSubscription.countDocuments();
    const admins = await PushSubscription.countDocuments({ role: 'admin' });
    const customers = await PushSubscription.countDocuments({ role: 'customer' });
    const iosDevices = await PushSubscription.countDocuments({
      $or: [
        { device: 'ios' },
        { userAgent: { $regex: /iPhone|iPad|iPod/i } },
      ],
    });

    res.json({
      total,
      admins,
      customers,
      iosDevices,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to fetch push stats' });
  }
});

export default router;
