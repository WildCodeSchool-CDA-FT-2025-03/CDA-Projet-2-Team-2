import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
@Entity('log')
export class Log extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ length: 250 })
  titre: string;

  @Field(() => String)
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, string | number | boolean>;

  @Field()
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'create_at',
  })
  createAt: Date;
}
