import { Field, InputType } from 'type-graphql';

@InputType()
export class CreatePlanningInput {
  @Field()
  start: string;

  @Field(() => String, { nullable: true })
  end: Date;

  @Field(() => String, { nullable: true })
  monday_start: string;

  @Field(() => String, { nullable: true })
  monday_end: string;

  @Field(() => String, { nullable: true })
  tuesday_start: string;

  @Field(() => String, { nullable: true })
  tuesday_end: string;

  @Field(() => String, { nullable: true })
  wednesday_start: string;

  @Field(() => String, { nullable: true })
  wednesday_end: string;

  @Field(() => String, { nullable: true })
  thursday_start: string;

  @Field(() => String, { nullable: true })
  thursday_end: string;

  @Field(() => String, { nullable: true })
  friday_start: string;

  @Field(() => String, { nullable: true })
  friday_end: string;

  @Field(() => String, { nullable: true })
  saturday_start: string;

  @Field(() => String, { nullable: true })
  saturday_end: string;

  @Field(() => String, { nullable: true })
  sunday_start: string;

  @Field(() => String, { nullable: true })
  sunday_end: string;
}
