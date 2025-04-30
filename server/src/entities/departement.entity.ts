import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { User } from './user.entity';

export enum DepartementStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

@ObjectType()
@Entity()
export class Departement extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  label: string;

  @Field()
  @Column()
  building: string;

  @Field()
  @Column()
  wing: string;

  @Field()
  @Column()
  level: string;

  @Field(() => String)
  @Column({
    type: 'enum',
    enum: DepartementStatus,
    default: DepartementStatus.ACTIVE,
  })
  status: DepartementStatus;

  @Field(() => [User])
  @OneToMany(() => User, (user) => user.departement)
  user: User[];

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
