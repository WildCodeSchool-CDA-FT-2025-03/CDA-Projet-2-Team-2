import { Arg, Query, Resolver } from 'type-graphql';
import { City } from '../entities/city.entity';

@Resolver()
export class CityResolver {
  @Query(() => City)
  async getCityByID(@Arg('cityId') cityId: number): Promise<City | null> {
    return await City.findOne({
      where: { id: cityId },
    });
  }

  @Query(() => [City])
  async getCityByCP(@Arg('postal_code') postal_code: string): Promise<City[] | null> {
    return await City.find({
      where: { postal_code: postal_code },
    });
  }
}
