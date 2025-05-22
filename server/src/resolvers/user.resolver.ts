import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { CreateUserInput } from '../types/user.type';
import { GraphQLError } from 'graphql';
import { Departement } from '../entities/departement.entity';
import log from '../utils/log';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async getAllUsers() {
    return await User.find({ relations: ['departement'] });
  }

  // 📋 checks if the email exists and requests sending of the reset email
  @Mutation(() => Boolean)
  async sendResetPassword(@Arg('email') email: string): Promise<boolean> {
    try {
      const userExist = await User.findOneBy({ email });

      if (userExist) {
        try {
          // 🔗 creating the jwt token and password reset url
          const resetToken = jwt.sign({ email }, `${process.env.JWT_SECRET}`);
          // 🔥 le lien url ne peut pas être testé maintenant.
          // Cela sera fait lors du process de réinitialisation du pwd (une prochaine PR)
          const url = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

          // ☎️ call the server_send_mail (/mail on Express)
          const response = await fetch(`${process.env.SERVER_SEND_MAIL}/mail/login/init`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, url }),
          });
          if (response.ok) {
            return true;
          }
        } catch (error) {
          return error;
        }
      }
      return false;
    } catch (error) {
      return error;
    }
  }

  @Query(() => [User])
  async getDoctorsByDepartement(@Arg('label') label: string): Promise<User[]> {
    return await User.find({
      relations: ['departement'],
      where: {
        role: UserRole.DOCTOR,
        status: UserStatus.ACTIVE,
        departement: {
          label,
        },
      },
    });
  }

  @Mutation(() => User)
  @Authorized([UserRole.ADMIN])
  async createUser(@Arg('input') input: CreateUserInput): Promise<User> {
    const departement = await Departement.findOneBy({ id: input.departementId });
    const userExist = await User.findOneBy({ email: input.email });

    if (userExist) {
      throw new GraphQLError('User with this email already exists', {
        extensions: {
          code: 'USER_CREATION_FAILED',
          originalError: "L'utilisateur existe déjà",
        },
      });
    }
    const hashedPassword = await argon2.hash(input.password);

    const newUser = new User();
    newUser.email = input.email;
    newUser.password = hashedPassword;
    newUser.firstname = input.firstname;
    newUser.lastname = input.lastname;
    newUser.role = input.role as UserRole;
    newUser.status = input.status as UserStatus;
    if (departement) {
      newUser.departement = departement;
    } else {
      throw new GraphQLError('Department not found');
    }

    await newUser.save();
    await log('User created', {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });
    return newUser;
  }
}
