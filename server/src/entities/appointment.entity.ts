import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import { ObjectType, Field, ID, Int } from 'type-graphql';
import { User } from './user.entity';
import { Patient } from './patient.entity';
import { AppointmentType } from './appointment-type.entity';

export enum AppointmentStatus {
  CONFIRMED = 'confirmed',
  CANCELED = 'canceled',
}

@ObjectType()
@Entity('appointment')
export class Appointment extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'timestamp' })
  start_time: string; // Date and start hour

  @Field(() => Int)
  @Column()
  duration: number; // in minutes

  @Field(() => AppointmentStatus)
  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.CONFIRMED,
  })
  status: AppointmentStatus;

  @Field(() => User)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  doctor: User;

  @Field(() => Patient)
  @ManyToOne(() => Patient, { eager: true })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Field(() => User)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @Field(() => AppointmentType)
  @ManyToOne(() => AppointmentType, { eager: true })
  @JoinColumn({ name: 'appointment_type_id' })
  appointmentType: AppointmentType;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
