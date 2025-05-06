import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class PatientInput {
  @Field(() => ID)
  id?: number;

  @Field({ nullable: true })
  email: string;

  @Field()
  firstname: string;

  @Field()
  lastname: string;

  @Field()
  phone_number: string;

  @Field()
  social_number: string;

  @Field()
  private_assurance: string;

  @Field()
  gender: string;

  @Field()
  birth_date: string;

  @Field()
  birth_city: string;

  @Field()
  note: string;

  @Field()
  adress: string;

  @Field()
  referring_physician: string;

  @Field()
  contact_person: string;

  @Field()
  postal_code: string;

  @Field()
  city: string;
}
