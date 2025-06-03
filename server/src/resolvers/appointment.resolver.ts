import { Resolver, Query, Arg, Authorized } from 'type-graphql';
import { Appointment } from '../entities/appointment.entity';
import { Between, Equal, MoreThan, LessThan } from 'typeorm';
import { UserRole } from '../entities/user.entity';

@Resolver()
export class AppointmentResolver {
  // 📌 Appointments by Departement
  @Query(() => [Appointment])
  @Authorized([UserRole.SECRETARY])
  async getAppointmentsByDepartement(
    @Arg('departementId') departementId: number,
  ): Promise<Appointment[]> {
    return Appointment.find({
      where: {
        departement: {
          id: Equal(departementId),
        },
      },
      order: { start_time: 'ASC' },
    });
  }

  @Query(() => [Appointment])
  @Authorized([UserRole.SECRETARY])
  async getDoctorByPatient(@Arg('patientId') patientId: string): Promise<Appointment[]> {
    return Appointment.find({
      where: {
        patient: {
          id: Equal(patientId),
        },
      },
      relations: ['doctor', 'doctor.departement', 'patient'],
    });
  }

  // 📌 Appointments by Doctor
  @Query(() => [Appointment])
  @Authorized([UserRole.SECRETARY])
  async getAppointmentsByDoctor(@Arg('doctorId') doctorId: number): Promise<Appointment[]> {
    return Appointment.find({
      where: {
        doctor: {
          id: Equal(doctorId),
        },
      },
      order: { start_time: 'ASC' },
    });
  }

  // 📌 Next Appointments by Patient
  @Query(() => [Appointment])
  @Authorized([UserRole.SECRETARY])
  async getNextAppointmentsByPatient(@Arg('patientId') patientId: string): Promise<Appointment[]> {
    return Appointment.find({
      where: {
        patient: {
          id: patientId,
        },
        start_time: MoreThan(new Date()),
      },
      order: { start_time: 'ASC' },
      relations: ['doctor', 'doctor.departement'],
    });
  }

  // 📌 Last Appointments by Patient
  @Query(() => [Appointment])
  @Authorized([UserRole.SECRETARY])
  async getLastAppointmentsByPatient(@Arg('patientId') patientId: string): Promise<Appointment[]> {
    return Appointment.find({
      where: {
        patient: {
          id: patientId,
        },
        start_time: LessThan(new Date()),
      },
      order: { start_time: 'DESC' },
      relations: ['doctor', 'doctor.departement'],
      take: 5,
    });
  }

  // 📌 Appointments by Day
  @Query(() => [Appointment])
  @Authorized([UserRole.SECRETARY])
  async getAppointmentsByDate(
    @Arg('date') date: string, // format YYYY-MM-DD
  ): Promise<Appointment[]> {
    // 💡 We create a "start" object representing the start of the day for the given date, at midnight in ISO 8601 format with UTC.
    // Display : 2025-05-07T00:00:00.000Z
    const start = new Date(`${date}T00:00:00.000Z`);
    // 💡 We create an "end" object representing the end of the day for the given date, at 23:59:59.999 UTC.
    const end = new Date(`${date}T23:59:59.999Z`);

    return Appointment.find({
      where: {
        start_time: Between(start, end),
      },
      order: { start_time: 'ASC' },
    });
  }

  // 📌 Appointments by Doctor and Day
  @Query(() => [Appointment])
  @Authorized([UserRole.SECRETARY])
  async getAppointmentsByDoctorAndDate(
    @Arg('doctorId') doctorId: number,
    @Arg('date') date: string, // format YYYY-MM-DD
  ): Promise<Appointment[]> {
    const start = new Date(`${date}T00:00:00.000Z`);
    const end = new Date(`${date}T23:59:59.999Z`);

    return Appointment.find({
      where: {
        doctor: {
          id: Equal(doctorId),
        },
        start_time: Between(start, end),
      },
      order: { start_time: 'ASC' },
    });
  }
}
