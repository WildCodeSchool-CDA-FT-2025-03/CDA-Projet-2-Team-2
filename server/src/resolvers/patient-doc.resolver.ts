import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { GraphQLError } from 'graphql';
import { PatientDoc } from '../entities/patient-doc.entity';
import { Patient } from '../entities/patient.entity';
import { DocType } from '../entities/doc-type.entity';
import { PatientDocInput } from '../types/patient-doc.type';

@Resolver()
export class PatientDocResolver {
  @Query(() => [PatientDoc])
  async getDocumentByID(@Arg('patientId') patientId: number): Promise<PatientDoc[] | null> {
    return await PatientDoc.find({
      where: { patient: { id: patientId } },
      relations: ['patient', 'docType'],
      order: { id: 'DESC' },
    });
  }

  @Mutation(() => PatientDoc)
  async addDocument(@Arg('docInput') docInput: PatientDocInput): Promise<PatientDoc> {
    try {
      const patientDoc = new PatientDoc();
      patientDoc.name = docInput.name;
      patientDoc.url = docInput.url;
      const PatientInfo = await Patient.findOneOrFail({
        where: { id: docInput.patientId },
      });
      patientDoc.patient = PatientInfo;
      const docTypeInfo = await DocType.findOneOrFail({
        where: { id: docInput.docTypeId },
      });
      patientDoc.docType = docTypeInfo;
      return await patientDoc.save();
    } catch (error) {
      console.error(error);
      throw new GraphQLError('Échec de la création du document', {
        extensions: {
          code: 'DOCUMENT_CREATION_FAILED',
          originalError: error.message,
        },
      });
    }
  }
}
