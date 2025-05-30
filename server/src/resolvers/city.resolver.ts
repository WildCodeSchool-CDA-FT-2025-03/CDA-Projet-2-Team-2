import { Arg, Query, Resolver, Authorized } from 'type-graphql';
import { City } from '../entities/city.entity';
import { UserRole } from '../entities/user.entity';

@Resolver()
export class CityResolver {
  @Query(() => City)
  @Authorized([UserRole.SECRETARY, UserRole.DOCTOR])
  async getCityByID(@Arg('cityId') cityId: number): Promise<City | null> {
    return await City.findOne({
      where: { id: cityId },
    });
  }

  @Query(() => [City])
  @Authorized([UserRole.SECRETARY, UserRole.DOCTOR])
  async getCityByCP(@Arg('postal_code') postal_code: string): Promise<City[] | null> {
    return await City.find({
      where: { postal_code: postal_code },
    });
  }
}
