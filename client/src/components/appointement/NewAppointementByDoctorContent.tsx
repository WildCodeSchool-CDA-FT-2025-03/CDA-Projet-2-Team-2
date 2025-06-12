import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DayPilotNavigator } from '@daypilot/daypilot-lite-react';
import {
  useGetUserByIdQuery,
  useGetAppointmentTypesQuery,
  useGetAppointmentsByDoctorAndDateQuery,
} from '@/types/graphql-generated';
import DoctorInfo from '@/components/appointement/DoctorInfo';
import FormAppointementDoctor from '@/components/appointement/FormAppointementDoctor';
import { Patient } from '@/types/patient.type';
import { useAppointmentContext } from '@/hooks/useAppointment';

export default function NewAppointementByDoctorContent() {
  const { id: doctorIdString } = useParams();
  const doctorId = doctorIdString ? parseInt(doctorIdString, 10) : undefined;
  const { selectedDay, handleSelectedDay } = useAppointmentContext();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const {
    data: doctorData,
    loading: doctorLoading,
    error: doctorError,
  } = useGetUserByIdQuery({
    variables: { id: doctorIdString || '' },
    skip: !doctorIdString,
  });

  const { data: appointmentTypesData } = useGetAppointmentTypesQuery();
  const appointmentTypes = [
    { key: '', value: '--- Choisissez un motif' },
    ...(appointmentTypesData?.getAppointmentTypes.map(type => ({
      key: type.id,
      value: type.reason,
    })) ?? []),
  ];

  const { data: appointmentsData } = useGetAppointmentsByDoctorAndDateQuery({
    variables: { doctorId: doctorId ?? 0, date: selectedDay.toString().slice(0, 10) },
    skip: !doctorId || !selectedDay,
  });

  const appointments =
    appointmentsData?.getAppointmentsByDoctorAndDate.map(appt => ({
      start_time: appt.start_time,
      duration: appt.duration,
    })) ?? [];

  if (doctorLoading) return <p>Chargement...</p>;
  if (doctorError) return <p>Erreur lors du chargement du médecin.</p>;

  return (
    <>
      <div className="w-[90%] max-w-5xl flex flex-col gap-6">
        <section className="flex flex-col gap-4 self-start  ">
          {doctorData?.getUserById && <DoctorInfo doctor={doctorData.getUserById} />}
        </section>
      </div>

      <section className="bg-bgBodyColor w-[90%] max-w-5xl mx-auto p-4 sm:p-6 md:p-12 lg:p-24 rounded-sm shadow-md border border-borderColor flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4">
        <aside>
          <DayPilotNavigator
            selectMode="Day"
            showMonths={1}
            skipMonths={1}
            locale="fr-fr"
            selectionDay={selectedDay}
            onTimeRangeSelected={args => handleSelectedDay(args.day)}
          />
        </aside>

        <FormAppointementDoctor
          selectedPatient={selectedPatient}
          setSelectedPatient={setSelectedPatient}
          appointmentTypes={appointmentTypes}
          appointments={appointments}
        />
      </section>
    </>
  );
}
