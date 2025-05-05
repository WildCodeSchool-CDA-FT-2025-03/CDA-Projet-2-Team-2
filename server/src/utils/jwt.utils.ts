import jwt from 'jsonwebtoken';
import { User, UserRole } from '../entities/user.entity';

type TokenPayload = {
  id: number;
  email: string;
  role: UserRole;
};

export const generateToken = (user: TokenPayload): string => {
  const payload: TokenPayload = {
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

export const parseCookie = (cookie: string): Record<string, string> =>
  cookie.split(';').reduce(
    (acc, current) => {
      const [key, value] = current.trim().split('=');
      acc[key] = value;
      return acc;
    },
    {} as Record<string, string>,
  );

export const getUserFromToken = async (cookie: string): Promise<User | null> => {
  const cookies = parseCookie(cookie);
  const token = cookies['token'];

  if (!token) {
    throw new Error('No token found');
  }

  const decoded = verifyToken(token);
  const user = await User.findOne({ where: { id: decoded.id } });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};
