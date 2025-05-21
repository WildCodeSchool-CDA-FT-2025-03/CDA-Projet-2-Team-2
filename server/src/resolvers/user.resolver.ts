import { Arg, Authorized, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { CreateUserInput } from '../types/user.type';
import { GraphQLError } from 'graphql';
import { Departement } from '../entities/departement.entity';
import log from '../utils/log';
import argon2 from 'argon2';
import { AuthMiddleware } from '../middlewares/auth.middleware';

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async getAllUsers() {
    return await User.find({ relations: ['departement'] });
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
