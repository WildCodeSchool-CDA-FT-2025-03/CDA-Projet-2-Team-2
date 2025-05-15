import { useState, useEffect, useMemo } from 'react';
import { useGetAppointmentsByDoctorAndDateLazyQuery } from '@/types/graphql-generated';
import { Appointment as AppointmentType } from '@/types/CalendarEvent.type';

export default function useAppointmentsDataMultiDoctor(doctorIds: number[], date: Date) {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [fetchAppointments] = useGetAppointmentsByDoctorAndDateLazyQuery();

  // ✅ Stable dependencies for useEffect
  const doctorKey = useMemo(() => doctorIds.join(','), [doctorIds]);
  // 📖 Arrays are references: two arrays [1,2,3] and [1,2,3] are equal in content, but not in reference.
  // So React (or a library like React Query) doesn't consider them equal unless they are transformed into a primitive string, such as with .join().
  const formattedDate = useMemo(() => date.toISOString().slice(0, 10), [date]);
  // 📖 We receive an object Date that we transform in ISO format "2025-05-15T14:30:00.000Z", then, we cut it in order to have "2025-05-15" in order to send a compatible date with our db

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
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('An unknown error has occurred'));
        }
        setAppointments([]);
      }
    };

    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorKey, formattedDate, fetchAppointments]);

  return { appointments, loading, error };
}
