import { useState, useEffect, useMemo } from 'react';
import { ApolloError } from '@apollo/client';
import { useGetAppointmentsByDoctorAndDateLazyQuery } from '@/types/graphql-generated';
import { Appointment as AppointmentType } from '@/types/CalendarEvent.type';

export default function useAppointmentsDataMultiDoctor(doctorIds: number[], date: Date) {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApolloError | null>(null);
  const [fetchAppointments] = useGetAppointmentsByDoctorAndDateLazyQuery();

  // ✅ Dépendances stables pour useEffect
  const doctorKey = useMemo(() => doctorIds.join(','), [doctorIds]);
  const formattedDate = useMemo(() => date.toISOString().slice(0, 10), [date]);

  useEffect(() => {
    const fetchAll = async () => {
      if (doctorIds.length === 0) {
        setAppointments([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const results = await Promise.all(
          doctorIds.map(async doctorId => {
            const res = await fetchAppointments({ variables: { doctorId, date: formattedDate } });
            return res.data?.getAppointmentsByDoctorAndDate ?? [];
          }),
        );

        const all = results.flat().map(appt => {
          const start = new Date(appt.start_time);
          const end = new Date(start.getTime() + appt.duration * 60 * 1000);

          return {
            id: String(appt.id),
            patient_name: `${appt.patient.firstname} ${appt.patient.lastname}`,
            start_time: start.toISOString(),
            end_time: end.toISOString(),
            statut: appt.status,
            appointment_type: appt.appointmentType.reason,
            doctor_id: String(appt.doctor.id),
          };
        });

        setAppointments(all);
        setError(null);
      } catch (err) {
        setError(err as ApolloError);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorKey, formattedDate, fetchAppointments]);

  return { appointments, loading, error };
}
