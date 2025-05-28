import { IsNumber, Min, MinLength, IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class AppointmentInput {
  @Field({ nullable: true })
  @IsString()
  @MinLength(1, { message: 'Le numéro de sécurité sociale ne peut pas être vide' })
  socialNumber?: string;

  @Field({ nullable: true })
  @IsNumber()
  @Min(1, { message: "L'ID du département doit être un nombre positif" })
  departmentId?: number;
}
