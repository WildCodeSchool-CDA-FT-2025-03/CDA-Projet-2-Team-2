import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { CreateUserInput } from '../types/user.type';
import { GraphQLError } from 'graphql';
import { Departement } from '../entities/departement.entity';

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async getAllUsers() {
    return await User.find({ relations: ['departement'] });
  }

  @Mutation(() => Boolean)
  async createUser(@Arg('data') data: CreateUserInput) {
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

    const newUser = new User();
    newUser.email = data.email;
    newUser.password = '';
    newUser.firstname = data.firstname;
    newUser.lastname = data.lastname;
    newUser.role = data.role as UserRole;
    newUser.status = data.status as UserStatus;
    if (departement) {
      newUser.departement = departement;
    }

    await newUser.save();
    return true;
  }
}
