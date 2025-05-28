import { InputType } from 'type-graphql';
import { IsNumber, Length } from 'class-validator';
import { Field } from 'type-graphql';

@InputType()
export class PatientDocInput {
  @Field()
  @Length(1, 255)
  name: string;

  @Field()
  @Length(1, 255)
  url: string;

  @Field()
  @IsNumber()
  patientId: number;

  @Field()
  @IsNumber()
  docTypeId: number;
}
