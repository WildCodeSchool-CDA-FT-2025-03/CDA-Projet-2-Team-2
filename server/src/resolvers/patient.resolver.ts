import { Arg, Query, Resolver } from 'type-graphql';
import { Patient } from '../entities/patient.entity';

@Resolver()
export class PatientResolver {
  @Query(() => Patient)
  async getPatientByID(@Arg('patientId') patientId: number): Promise<Patient | null> {
    return await Patient.findOne({
      where: { id: patientId },
      relations: ['city'],
    });
  }
}
