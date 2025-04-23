import jwt from 'jsonwebtoken';
import { User } from '../entities/user.entity';

export const generateToken = (user: User): string => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'default_secret_key', {
    expiresIn: '1d',
  });
};

export const verifyToken = (token: string): { id: number; email: string; role: string } => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key');
    return decoded as { id: number; email: string; role: string };
  } catch (error) {
    console.error(error);
    throw new Error('Invalid token');
  }
};
