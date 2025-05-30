import { Arg, Mutation, Query, Resolver, Authorized } from 'type-graphql';
import { Departement, DepartementStatus } from '../entities/departement.entity';
import { GraphQLError } from 'graphql';
import { DepartementInput } from '../types/departement.type';
import { UserRole } from '../entities/user.entity';

@Resolver()
export class DepartementResolver {
  @Query(() => [Departement])
  @Authorized([UserRole.SECRETARY, UserRole.DOCTOR, UserRole.ADMIN, UserRole.AGENT])
  async getDepartements(): Promise<Departement[]> {
    return await Departement.find({
      relations: {
        user: true,
      },
    });
  }

  @Mutation(() => Boolean)
  @Authorized([UserRole.ADMIN])
  async createDepartement(@Arg('data') data: DepartementInput) {
    try {
      const newDepartement = new Departement();
      newDepartement.label = data.label;
      newDepartement.building = data.building;
      newDepartement.wing = data.wing;
      newDepartement.level = data.level;

      await newDepartement.save();
      return true;
    } catch (error) {
      console.error(error);
      throw new GraphQLError('Échec de la création de département', {
        extensions: {
          code: 'DEPARTEMENT_CREATION_FAILED',
          originalError: error.message,
        },
      });
    }
  }

  @Mutation(() => Boolean)
  @Authorized([UserRole.ADMIN])
  async updateDepartment(@Arg('id') id: string, @Arg('data') data: DepartementInput) {
    const department = await Departement.findOneBy({ id: +id });
    if (!department) {
      throw new GraphQLError('Service non trouvé', {
        extensions: {
          code: 'DEPARTEMENT_NOT_FOUND',
        },
      });
    }
    if (department.label !== data.label) {
      department.label = data.label;
    }
    department.building = data.building;
    department.wing = data.wing;
    department.level = data.level;
    department.save();
    return true;
  }

  @Mutation(() => Boolean)
  @Authorized([UserRole.ADMIN])
  async changeDepartmentStatus(@Arg('id') id: string) {
    const department = await Departement.findOneBy({ id: +id });
    if (!department) {
      throw new GraphQLError('Service non trouvé', {
        extensions: {
          code: 'DEPARTEMENT_NOT_FOUND',
        },
      });
    }
    department.status =
      department.status === DepartementStatus.ACTIVE
        ? DepartementStatus.INACTIVE
        : DepartementStatus.ACTIVE;

    await Departement.update({ id: department.id }, { ...department });
    return true;
  }
}
