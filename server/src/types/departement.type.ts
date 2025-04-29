import { Field, InputType } from 'type-graphql';

@InputType()
export class DepartementInput {
  @Field()
  label: string;
}
