import { MiddlewareFn } from 'type-graphql';
import { User } from '../entities/user.entity';
import { getUserFromToken } from '../utils/jwt.utils';
import { IncomingMessage, ServerResponse } from 'http';

export const AuthMiddleware: MiddlewareFn<{
  req: IncomingMessage;
  res: ServerResponse<IncomingMessage>;
  user?: User;
}> = async ({ context }, next) => {
  try {
    const cookie = context.req.headers.cookie;

    if (!cookie) {
      return next();
    }

    const user = await getUserFromToken(cookie);

    if (user) {
      context.user = user;
    }

    return next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return next();
  }
};
