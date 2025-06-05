import { Arg, Query, Resolver } from 'type-graphql';
import { DoctorAppointmentSlot } from '../entities/doctorAppointmentSlot.entity';

@Resolver()
export class doctorAppointmentSlotResolver {
  @Query(() => [DoctorAppointmentSlot])
  async getDoctorSlotByID(
    @Arg('doctorId') doctorId: number,
    @Arg('date') date: string,
  ): Promise<DoctorAppointmentSlot[] | null> {
    return await DoctorAppointmentSlot.find({
      where: { user_id: doctorId.toString(), jour: date },
    });
  }

  @Query(() => [DoctorAppointmentSlot])
  async getDoctorSlotByDepartement(
    @Arg('departement_id') departement_id: number,
    @Arg('date') date: string,
  ): Promise<DoctorAppointmentSlot[] | null> {
    return await DoctorAppointmentSlot.find({
      where: { departement_id: departement_id.toString(), jour: date },
      order: { user_id: 'ASC', debut_libre: 'ASC' },
    });
  }
}
