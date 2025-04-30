import argon2 from 'argon2';
import { Resolver, Mutation, Arg, Ctx, Query } from 'type-graphql';
import { Response, Request } from 'express';

import { User } from '../entities/user.entity';
import { LoginInput, AuthResponse } from '../types/auth.type';
import { generateToken, verifyToken } from '../utils/jwt.utils';

@Resolver()
export class AuthResolver {
  @Mutation(() => AuthResponse)
  async login(
    @Arg('input') input: LoginInput,
    @Ctx() context: { res: Response },
  ): Promise<AuthResponse> {
    const user = await User.findOne({
      where: { email: input.email },
      relations: ['departement'],
    });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await argon2.verify(user.password, input.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken(user);

    context.res.setHeader(
      'Set-Cookie',
      `token=${token}; HttpOnly; Secure; Max-Age=${1 * 24 * 60 * 60 * 1000}`,
    );

    return { token, user };
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() context: { req: Request }): Promise<User | null> {
    try {
      const cookie = context.req.headers.cookie;
      if (!cookie) {
        return null;
      }

      const cookies = cookie.split(';').reduce(
        (acc, current) => {
          const [key, value] = current.trim().split('=');
          acc[key] = value;
          return acc;
        },
        {} as Record<string, string>,
      );

      const token = cookies['token'];
      if (!token) {
        return null;
      }

      const decoded = verifyToken(token);

      const user = await User.findOne({
        where: { id: decoded.id },
        relations: ['departement'],
      });

      return user;
    } catch (error) {
      console.error('Error verifying authentication:', error);
      return null;
    }
  }
}
