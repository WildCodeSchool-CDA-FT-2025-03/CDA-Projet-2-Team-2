import { Resolver, Query, Arg } from 'type-graphql';
import { Appointment } from '../entities/appointment.entity';
import { Between, Equal, MoreThan, LessThan } from 'typeorm';

@Resolver()
export class AppointmentResolver {
  @Query(() => String)
  helloAppointments() {
    return 'Hello from appointments!';
  }

  // 📌 Appointments by Departement
  @Query(() => [Appointment])
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
  async getDoctorByPatient(@Arg('patientId') patientId: number): Promise<Appointment[]> {
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

  // 📌 Appointments by Doctor
  @Query(() => [Appointment])
  async getNextAppointmentsByPatient(@Arg('patientId') patientId: number): Promise<Appointment[]> {
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

  // 📌 Appointments by Doctor
  @Query(() => [Appointment])
  async getLastAppointmentsByPatient(@Arg('patientId') patientId: number): Promise<Appointment[]> {
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
