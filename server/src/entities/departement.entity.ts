import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, InputType, ObjectType } from 'type-graphql';

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

  @Field(() => String)
  @Column({
    type: 'enum',
    enum: DepartementStatus,
    default: DepartementStatus.PENDING,
  })
  status: DepartementStatus;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}

@InputType()
export class DepartementInput {
  @Field()
  label: string;
}
