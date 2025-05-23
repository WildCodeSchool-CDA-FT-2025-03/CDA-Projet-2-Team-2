import argon2 from 'argon2';
import { Resolver, Mutation, Arg, Ctx, Query, UseMiddleware, Authorized } from 'type-graphql';
import { Response } from 'express';

import log from '../utils/log';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { Departement } from '../entities/departement.entity';
import { LoginInput, AuthResponse } from '../types/auth.type';
import { CreateUserInput } from '../types/user.type';
import { generateToken } from '../utils/jwt.utils';
import { AuthMiddleware } from '../middlewares/auth.middleware';

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

    return { user };
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(AuthMiddleware)
  async me(@Ctx() context: { user: User }): Promise<User | null> {
    return context.user;
  }

  @Mutation(() => User)
  @Authorized([UserRole.ADMIN])
  async createUser(@Arg('input') input: CreateUserInput): Promise<User> {
    const existingUser = await User.findOne({ where: { email: input.email } });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const departement = await Departement.findOne({
      where: { id: input.departementId },
    });

    if (!departement) {
      throw new Error('Department not found');
    }

    const hashedPassword = await argon2.hash(input.password);

    const user = new User();
    user.email = input.email;
    user.password = hashedPassword;
    user.firstname = input.firstname;
    user.lastname = input.lastname;
    user.departement = departement;
    user.role = input.role || User.prototype.role;
    user.status = input.status || UserStatus.PENDING;

    await user.save();

    await log('User created', {
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return user;
  }
}
