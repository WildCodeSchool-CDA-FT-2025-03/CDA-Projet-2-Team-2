import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Patient } from '../entities/patient.entity';
import { PatientInput } from '../types/patient.type';
import { City } from '../entities/city.entity';

@Resolver()
export class PatientResolver {
  @Query(() => Patient)
  async getPatientByID(@Arg('patientId') patientId: number): Promise<Patient | null> {
    const patient = await Patient.findOne({
      where: { id: patientId },
      relations: ['city'],
    });

    if (!patient) {
      throw new Error('Patient inconnu');
    }
    return patient;
  }

  @Mutation(() => Patient)
  async updatePatient(@Arg('patientData') patientData: PatientInput): Promise<Patient | null> {
    const patient = await Patient.findOne({
      where: { id: patientData.id },
    });

    if (!patient) {
      throw new Error('Patient inconnu');
    }

    const newcity = await City.findOne({
      where: { postal_code: patientData.postal_code, city: patientData.city },
    });

    patient.firstname = patientData.firstname;
    patient.lastname = patientData.lastname;
    patient.phone_number = patientData.phone_number;
    patient.social_number = patientData.social_number;
    patient.private_assurance = patientData.private_assurance;
    patient.adress = patientData.adress;
    patient.referring_physician = patientData.referring_physician;
    patient.contact_person = patientData.contact_person;
    patient.birth_date = patientData.birth_date;
    patient.birth_city = patientData.birth_city;
    patient.note = patientData.note;
    patient.email = patientData.email;
    patient.gender = patientData.gender;
    if (newcity) {
      patient.city = newcity;
    }
    await patient.save();

    return patient;
  }
}
