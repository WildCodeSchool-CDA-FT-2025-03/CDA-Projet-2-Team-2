import { Query, Resolver } from 'type-graphql';
import { User } from '../entities/user.entity';

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async getAllUsers() {
    return await User.find({ relations: ['departement'] });
  }
}
