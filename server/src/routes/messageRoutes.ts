import { Router, Response } from 'express';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { Message } from '../models/Message';
import { sendPushToRole } from '../config/webPush';

const router = Router();

// ============================================================================
// 1. POST /api/messages - Customer sends a message (must be logged in)
// ============================================================================
router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { subject, message, orderNumber, senderPhone } = req.body;

    if (!subject?.trim() || !message?.trim()) {
      res.status(400).json({ message: 'Subject and message are required' });
      return;
    }

    const sender = req.user!;

    const newMessage = await Message.create({
      senderId: sender.id,
      senderName: req.body.senderName || sender.email.split('@')[0],
      senderEmail: sender.email.toLowerCase().trim(),
      senderPhone: senderPhone || '',
      subject: subject.trim(),
      message: message.trim(),
      orderNumber: orderNumber?.trim() || '',
      status: 'new',
    });

    // Send instant Web Push Notification to Store Admin
    try {
      await sendPushToRole('admin', {
        title: '📩 رسالة جديدة من عميل | New Message',
        body: `${newMessage.senderName}: "${newMessage.subject.slice(0, 45)}"`,
        icon: '/apple-touch-icon.png',
        badge: '/apple-touch-icon.png',
        url: '/#admin?tab=messages',
        tag: `message-${newMessage._id}`,
      });
      console.log(`[WebPush] Admin alerted of new message from ${newMessage.senderEmail}`);
    } catch (pushErr) {
      console.warn('[WebPush] Notice: failed to trigger admin push alert for message:', pushErr);
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully. Our team will review and reply shortly.',
      data: newMessage,
    });
  } catch (error: any) {
    console.error('Error creating customer message:', error);
    res.status(500).json({ message: error.message || 'Failed to submit message' });
  }
});

// ============================================================================
// 2. GET /api/messages/my - Customer views their own messages & tracking status
// ============================================================================
router.get('/my', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sender = req.user!;
    const messages = await Message.find({
      $or: [
        { senderId: sender.id },
        { senderEmail: sender.email.toLowerCase().trim() },
      ],
    }).sort({ createdAt: -1 });

    res.json(messages);
  } catch (error: any) {
    console.error('Error fetching customer messages:', error);
    res.status(500).json({ message: error.message || 'Failed to load messages' });
  }
});

// ============================================================================
// 3. GET /api/messages - Admin views all messages
// ============================================================================
router.get('/', authenticateToken, requireAdmin, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error: any) {
    console.error('Error fetching all messages for admin:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch messages' });
  }
});

// ============================================================================
// 4. PUT /api/messages/:id/reply - Admin replies and updates status
// ============================================================================
router.put('/:id/reply', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { adminReply, status = 'resolved' } = req.body;

    const messageDoc = await Message.findById(id);
    if (!messageDoc) {
      res.status(404).json({ message: 'Message not found' });
      return;
    }

    if (adminReply !== undefined) {
      messageDoc.adminReply = adminReply.trim();
      messageDoc.repliedAt = new Date();
      messageDoc.repliedBy = req.user?.email || 'HADAB Admin';
    }
    if (status) {
      messageDoc.status = status;
    }

    await messageDoc.save();

    res.json({
      success: true,
      message: 'Reply saved and customer notification updated',
      data: messageDoc,
    });
  } catch (error: any) {
    console.error('Error replying to message:', error);
    res.status(500).json({ message: error.message || 'Failed to reply to message' });
  }
});

// ============================================================================
// 5. DELETE /api/messages/:id - Admin deletes a message
// ============================================================================
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Message.findByIdAndDelete(id);
    res.json({ success: true, message: 'Message removed successfully' });
  } catch (error: any) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: error.message || 'Failed to delete message' });
  }
});

export default router;
