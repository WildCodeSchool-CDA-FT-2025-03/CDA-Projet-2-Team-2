import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { CreateUserInput } from '../types/user.type';
import { GraphQLError } from 'graphql';
import { Departement } from '../entities/departement.entity';
import log from '../utils/log';
import argon2 from 'argon2';
import { ILike } from 'typeorm';

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
  async createUser(@Arg('input') input: CreateUserInput): Promise<User> {
    const departement = await Departement.findOneBy({ id: +input.departementId });
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
    newUser.profession = input.profession;
    newUser.gender = input.gender;
    newUser.tel = input.tel;
    newUser.activationDate = input.activationDate ? new Date(input.activationDate) : undefined;
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
