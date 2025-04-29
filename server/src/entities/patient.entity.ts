import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { City } from './city.entity';

@ObjectType()
@Entity('patient')
export class Patient extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column()
  firstname: string;

  @Field()
  @Column()
  lastname: string;

  @Field()
  @Column()
  phone_number: string;

  @Field()
  @Column()
  social_number: string;

  @Field()
  @Column()
  private_assurance: string;

  @Field()
  @Column({ length: 15 })
  gender: string;

  @Field()
  @Column({ type: 'date' })
  birth_date: Date;

  @Field()
  @Column({ type: 'text' })
  note: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Field(() => City)
  @ManyToOne(() => City, (city) => city.patients)
  city: City;
}
