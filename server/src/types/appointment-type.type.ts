import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class Appointment {
  @Field(() => Int)
  id: number;

  @Field()
  reason: string;
}
