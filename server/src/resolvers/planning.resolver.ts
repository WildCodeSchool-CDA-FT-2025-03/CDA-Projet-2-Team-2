import { Arg, Authorized, Mutation, Query, Resolver } from 'type-graphql';
import { User, UserRole } from '../entities/user.entity';
import { GraphQLError } from 'graphql';
import log from '../utils/log';
import { Planning } from '../entities/planning.entity';
import { CreatePlanningInput } from '../types/planning.type';

@Resolver()
export class PlanningResolver {
  @Query(() => [Planning])
  // @Authorized([UserRole.SECRETARY, UserRole.DOCTOR])
  async getPlanningByDoctor(@Arg('doctorId') doctorId: number): Promise<Planning[]> {
    const planning = await Planning.find({
      where: { user: { id: doctorId } },
      relations: ['user'],
    });

    if (!planning.length) {
      throw new Error('Doctor non trouvé');
    }
    return planning;
  }

  @Mutation(() => Planning)
  @Authorized([UserRole.ADMIN])
  async createDoctorPlanning(
    @Arg('input') input: CreatePlanningInput,
    @Arg('id') id: string,
  ): Promise<Planning> {
    const user = await User.findOneBy({ id: +id });
    if (!user) {
      throw new GraphQLError('Doctor non trouvé');
    }
    function formatTimeForPostgres(timeStr: string | null): string | null {
      if (!timeStr) {
        return null;
      }
      return `${timeStr.replace('h', ':')}:00`;
    }
    const newPlanning = new Planning();
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    days.forEach((day: string) => {
      const startKey = `${day}_start` as keyof CreatePlanningInput;
      const endKey = `${day}_end` as keyof CreatePlanningInput;

      const formattedStart = formatTimeForPostgres(input[startKey] as string);
      if (formattedStart) {
        newPlanning[startKey] = formattedStart;
      }

      const formattedEnd = formatTimeForPostgres(input[endKey] as string);
      if (formattedEnd) {
        newPlanning[endKey] = formattedEnd;
      }
    });

    newPlanning.start = input.start ?? new Date().toISOString();
    newPlanning.user = user;
    await newPlanning.save();
    await log('User planning created', {
      PlanningId: newPlanning.id,
      userId: newPlanning.user.id,
      role: newPlanning.user.role,
    });
    return newPlanning;
  }
}
