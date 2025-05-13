import { ObjectType, Field, ID } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('appointement-type')
export class AppointmentType extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  reason: string;
}
