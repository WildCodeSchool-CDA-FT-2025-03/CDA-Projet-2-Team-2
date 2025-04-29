import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Departement, DepartementInput } from '../entities/departement.entity';
import { GraphQLError } from 'graphql';

@Resolver()
export class DepartementResolver {
  @Query(() => [Departement])
  async getDepartements(): Promise<Departement[]> {
    return await Departement.find();
  }

  @Mutation(() => Boolean)
  async createDepartement(@Arg('data') data: DepartementInput) {
    try {
      const newDepartement = new Departement();
      newDepartement.label = data.label;
      await newDepartement.save();
      return true;
    } catch (error) {
      console.error(error);
      throw new GraphQLError('Failed to create departement', {
        extensions: {
          code: 'DEPARTEMENT_CREATION_FAILED',
          originalError: error.message,
        },
      });
    }
  }
}
