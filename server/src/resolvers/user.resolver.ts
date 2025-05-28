import { Arg, Authorized, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { CreateUserInput } from '../types/user.type';
import { GraphQLError } from 'graphql';
import { Departement } from '../entities/departement.entity';
import log from '../utils/log';
import argon2 from 'argon2';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import jwt from 'jsonwebtoken';
import { ResetPasswordInput } from '../types/user.type';

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

  // 🖲️ Reset password
  @Mutation(() => Boolean)
  async resetPassword(@Arg('input') { token, password }: ResetPasswordInput): Promise<boolean> {
    try {
      // 📤 retrieve the email in the token
      const { email } = jwt.verify(token, process.env.JWT_SECRET || '') as unknown as {
        email: string;
      };

      // then check that the user exists
      const userUpdate = await User.findOneBy({ email });
      if (!userUpdate) {
        throw new Error('Utilisateur inconnu');
      }
      // ⚙️ hash and update new password
      const hashedPassword = await argon2.hash(password);
      userUpdate.password = hashedPassword;
      await userUpdate.save();
      return true;
    } catch (error) {
      throw new Error(error);
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
  @UseMiddleware(AuthMiddleware)
  async createUser(
    @Ctx() context: { user: User },
    @Arg('input') input: CreateUserInput,
  ): Promise<User> {
    const departement = await Departement.findOneBy({ id: +input.departementId });
    if (!departement) {
      throw new GraphQLError('Department not found');
    }

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
    try {
      const newUser = new User();
      newUser.email = input.email;
      newUser.password = hashedPassword;
      newUser.firstname = input.firstname;
      newUser.lastname = input.lastname;
      newUser.role = input.role as UserRole;
      newUser.profession = input.profession;
      newUser.gender = input.gender;
      newUser.tel = input.tel;
      if (input.activationDate) {
        newUser.activationDate = input.activationDate;
      }
      newUser.status = input.status as UserStatus;

      newUser.departement = departement;

      await newUser.save();
      await log('User created', {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
        createdBy: context.user.id,
      });
      return newUser;
    } catch (error) {
      console.error(error);
      throw new GraphQLError(`Échec de la création de l'utilisateur`, {
        extensions: {
          code: 'USER_CREATION_FAILED',
          originalError: error.message,
        },
      });
    }
  }
}
