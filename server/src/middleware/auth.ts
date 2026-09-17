import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access token required. Please log in as admin.' });
    return;
  }

  const secret = process.env.JWT_SECRET || 'hadab_secret_fallback';
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      res.status(403).json({ message: 'Invalid or expired token. Please sign in again.' });
      return;
    }
    req.user = decoded as { id: string; email: string; role: string };
    next();
  });
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const isSuperAdmin = req.user?.email?.toLowerCase() === 'byhadab@gmail.com';
  const hasAdminRole = req.user?.role === 'admin';

  if (!req.user || (!hasAdminRole && !isSuperAdmin)) {
    res.status(403).json({ message: 'Admin access forbidden. Administrator account required.' });
    return;
  }
  next();
};
