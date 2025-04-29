import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class Planning extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String, { nullable: true })
  @Column({ type: 'time', nullable: true })
  start: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'time', nullable: true })
  end: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'time', nullable: true })
  monday_start: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'time', nullable: true })
  monday_end: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'time', nullable: true })
  tuesday_start: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'time', nullable: true })
  tuesday_end: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'time', nullable: true })
  wednesday_start: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'time', nullable: true })
  wednesday_end: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'time', nullable: true })
  thursday_start: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'time', nullable: true })
  thursday_end: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'time', nullable: true })
  saturday_start: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'time', nullable: true })
  saturday_end: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'time', nullable: true })
  sunday_start: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'time', nullable: true })
  sunday_end: string;

  @Field(() => User)
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field()
  @Column()
  user_id: number;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
