import { IsNumber, Min, IsString, Matches } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class AppointmentInput {
  @Field({ nullable: true })
  @IsString()
  @Matches(/^[0-9\s]+$/, {
    message: 'Le numéro de sécurité sociale ne doit contenir que des chiffres et des espaces',
  })
  socialNumber?: string;

  @Field({ nullable: true })
  @IsNumber()
  @Min(1, { message: "L'ID du département doit être un nombre positif" })
  departmentId?: number;
}
