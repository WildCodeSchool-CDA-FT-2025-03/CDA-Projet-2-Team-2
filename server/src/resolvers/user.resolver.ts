import { Arg, Authorized, Ctx, Int, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { CreateUserInput, UsersWithTotal } from '../types/user.type';
import { GraphQLError } from 'graphql';
import { Departement } from '../entities/departement.entity';
import log from '../utils/log';
import argon2 from 'argon2';
import { ILike } from 'typeorm';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import jwt from 'jsonwebtoken';
import { ResetPasswordInput, sendEmailInput } from '../types/user.type';

@Resolver()
//@Authorized([UserRole.ADMIN])
export class UserResolver {
  @Query(() => UsersWithTotal)
  async getAllUsers(
    @Arg('limit', () => Int, { nullable: true }) limit?: number,
    @Arg('page', () => Int, { nullable: true }) page?: number,
    @Arg('search', { nullable: true }) search?: string,
  ) {
    const take = limit ?? 0;
    const skip = page && page > 0 ? (page - 1) * take : 0;
    const [users, total] = await User.findAndCount({
      relations: ['departement'],
      order: { lastname: 'ASC' },
      take,
      skip,
      where: [{ firstname: ILike(`%${search}%`) }, { lastname: ILike(`%${search}%`) }],
    });
    return { users, total };
  }

  // 📋 checks if the email exists and requests sending of the reset email
  @Mutation(() => Boolean)
  async sendResetPassword(@Arg('email') { email }: sendEmailInput): Promise<boolean> {
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
            // ♻️ log the password reset request
            await log('Demande de réinitialisation de mot de passe', {
              email: email,
            });
            return true;
          }
        } catch (error) {
          return error;
        }
      }
      // log suspicious password reset request
      await log('⚠️ Demande de réinitialisation suspecte de mot de passe', {
        email: email,
      });
      return false; // the user does not exist
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

      // 📋 log the user's password reset action
      await log('Nouveau mot de passe utilisateur', {
        user: userUpdate.id,
        email: userUpdate.email,
        role: userUpdate.role,
      });
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  @Query(() => [User])
  @Authorized([UserRole.SECRETARY])
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

  @Query(() => [User])
  @Authorized([UserRole.SECRETARY])
  async searchDoctors(@Arg('query') query: string): Promise<User[]> {
    return User.find({
      where: [
        { role: UserRole.DOCTOR, status: UserStatus.ACTIVE, firstname: ILike(`%${query}%`) },
        { role: UserRole.DOCTOR, status: UserStatus.ACTIVE, lastname: ILike(`%${query}%`) },
      ],
      relations: ['departement'],
      take: 5,
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

  @Mutation(() => Boolean)
  @Authorized([UserRole.ADMIN])
  async changeStatusStatus(@Arg('id') id: string) {
    const user = await User.findOneBy({ id: +id });
    if (!user) {
      throw new GraphQLError('User non trouvé', {
        extensions: {
          code: 'USER_NOT_FOUND',
        },
      });
    }

    user.status = user.status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE;

    await User.update({ id: user.id }, { ...user });
    return true;
  }
}
