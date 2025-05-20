import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

import { Patient } from './patient.entity';
import { DocType } from './doc-type.entity';

@ObjectType()
@Entity()
export class PatientDoc extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column()
  url: string;

  @Field(() => Patient)
  @ManyToOne(() => Patient, (patient) => patient.patient_docs)
  patient: Patient;

  @Field(() => DocType)
  @ManyToOne(() => DocType, (docType) => docType.patient_docs_type)
  docType: DocType;
}
