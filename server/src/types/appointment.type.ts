import { Field, ObjectType, Int } from 'type-graphql';
import { User } from '../entities/user.entity';
import { Patient } from '../entities/patient.entity';

@ObjectType()
export class Appointment {
  @Field(() => Int)
  id: number;

  @Field()
  start_time: string;

  @Field(() => Int)
  duration: number;

  @Field(() => User)
  doctor: User;

  @Field(() => Patient)
  patient: Patient;
}
