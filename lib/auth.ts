// lib/auth.ts
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

interface AuthenticatedNextApiRequest extends NextApiRequest {
  user?: {
    userId: number;
    username: string;
  };
}

export const authenticate = (handler: Function) => async (req: AuthenticatedNextApiRequest, res: NextApiResponse) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number; username: string };
    req.user = decoded;
    return handler(req, res);
  } catch (error) {
    console.error('Authentication Error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};