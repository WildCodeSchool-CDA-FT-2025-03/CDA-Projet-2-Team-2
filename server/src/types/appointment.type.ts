import { Field, InputType } from 'type-graphql';
import { AppointmentStatus } from '../entities/appointment.entity';

@InputType()
export class AppointmentCreateInput {
  @Field()
  id?: number;

  @Field()
  start_time: Date; // Date and start hour

  @Field()
  duration: number; // in minutes

  @Field(() => String, { nullable: true })
  status?: AppointmentStatus;

  @Field()
  user_id: string; // Doctor ID

  @Field()
  patient_id: string;

  @Field()
  created_by: string;

  @Field()
  appointmentType: string;

  @Field()
  departement: string;
}
