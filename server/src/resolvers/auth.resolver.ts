import argon2 from 'argon2';
import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import { Response } from 'express';

import { User } from '../entities/user.entity';
import { LoginInput, AuthResponse } from '../types/auth.type';
import { generateToken } from '../utils/jwt.utils';

@Resolver()
export class AuthResolver {
  @Mutation(() => AuthResponse)
  async login(
    @Arg('input') input: LoginInput,
    @Ctx() context: { res: Response },
  ): Promise<AuthResponse> {
    const user = await User.findOne({ where: { email: input.email } });
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
}
