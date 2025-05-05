import { MiddlewareFn } from 'type-graphql';
import { User } from '../entities/user.entity';
import { verifyToken } from '../utils/jwt.utils';
import { IncomingMessage, ServerResponse } from 'http';

export const AuthMiddleware: MiddlewareFn<{
  req: IncomingMessage;
  res: ServerResponse<IncomingMessage>;
  user?: User;
}> = async ({ context }, next) => {
  try {
    const { req } = context;
    const cookie = req.headers.cookie;

    if (cookie) {
      const cookies = cookie.split(';').reduce(
        (acc, current) => {
          const [key, value] = current.trim().split('=');
          acc[key] = value;
          return acc;
        },
        {} as Record<string, string>,
      );

      const token = cookies['token'];

      if (token) {
        const decoded = verifyToken(token);
        const user = await User.findOne({
          where: { id: decoded.id },
          relations: ['departement'],
        });

        if (user) {
          context.user = user;
        }
      }
    }

    return next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return next();
  }
};
