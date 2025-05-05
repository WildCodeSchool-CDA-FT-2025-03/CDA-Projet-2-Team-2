import { Field, InputType } from 'type-graphql';

@InputType()
export class DepartementInput {
  @Field()
  label: string;

  @Field()
  building: string;

  @Field()
  wing: string;

  @Field()
  level: string;

  @Field()
  status: string;
}
