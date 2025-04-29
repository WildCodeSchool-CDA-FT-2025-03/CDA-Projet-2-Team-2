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
}
