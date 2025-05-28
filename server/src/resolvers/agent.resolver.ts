import { Resolver, Query, Arg, Authorized } from 'type-graphql';
import { Appointment, AppointmentStatus } from '../entities/appointment.entity';
import { UserRole } from '../entities/user.entity';
import { Between } from 'typeorm';
import { AppointmentInput } from '../types/agent.type';

@Resolver()
export class AgentResolver {
  @Query(() => [Appointment])
  @Authorized([UserRole.AGENT])
  async getUpcomingAppointmentsByPatientAndDepartment(
    @Arg('input') input: AppointmentInput,
  ): Promise<Appointment[]> {
    if (!input.socialNumber && !input.departmentId) {
      throw new Error('Either socialNumber or departmentId must be provided');
    }

    const now = new Date();
    const thirtyMinutesLater = new Date(now.getTime() + 30 * 60 * 1000);

    const where: {
      status: AppointmentStatus;
      start_time: ReturnType<typeof Between<Date>>;
      patient?: { social_number: string };
      departement?: { id: number };
    } = {
      status: AppointmentStatus.CONFIRMED,
      start_time: Between<Date>(now, thirtyMinutesLater),
    };

    if (input.socialNumber) {
      where.patient = { social_number: input.socialNumber };
    }

    if (input.departmentId) {
      where.departement = { id: input.departmentId };
    }

    return Appointment.find({
      where: where,
      relations: ['patient', 'doctor', 'departement', 'appointmentType'],
      order: { start_time: 'ASC' },
    });
  }
}
