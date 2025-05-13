import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { CreateUserInput } from '../types/user.type';
import { GraphQLError } from 'graphql';
import { Departement } from '../entities/departement.entity';
import log from '../utils/log';
import argon2 from 'argon2';

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async getAllUsers() {
    return await User.find({ relations: ['departement'] });
  }

  @Mutation(() => Boolean)
  @Authorized([UserRole.ADMIN])
  async createUser(@Arg('data') data: CreateUserInput): Promise<boolean> {
    const departement = await Departement.findOneBy({ id: data.departementId });
    const userExist = await User.findOneBy({ email: data.email });

    if (userExist) {
      throw new GraphQLError("Échec de la création de l'utilisateur", {
        extensions: {
          code: 'USER_CREATION_FAILED',
          originalError: "l'utilisateur existe déjà",
        },
      });
    }
    const hashedPassword = await argon2.hash(data.password);

    const newUser = new User();
    newUser.email = data.email;
    newUser.password = hashedPassword;
    newUser.firstname = data.firstname;
    newUser.lastname = data.lastname;
    newUser.role = data.role as UserRole;
    newUser.status = data.status as UserStatus;
    if (departement) {
      newUser.departement = departement;
    }

    await newUser.save();
    await log('User created', {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });
    return true;
  }
}
