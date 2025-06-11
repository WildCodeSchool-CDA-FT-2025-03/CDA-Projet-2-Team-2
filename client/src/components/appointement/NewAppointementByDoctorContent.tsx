import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DayPilotNavigator } from '@daypilot/daypilot-lite-react';
import {
  useGetUserByIdQuery,
  useGetAppointmentTypesQuery,
  useGetAppointmentsByDoctorAndDateQuery,
  GetUserByIdQuery,
} from '@/types/graphql-generated';
import { getDisabledTimes } from '@/utils/getAppointementTimeStartDisabled';
import { generateTimeOptions } from '@/utils/generatedTimeOptions';
import { useAppointmentContext } from '@/hooks/useAppointment';
import DoctorInfo from '@/components/appointement/DoctorInfo';
import PatientSearch from '@/components/appointement/PatientSearch';
import SelectForm from '@/components/form/SelectForm';
import DateTimeSection from '@/components/appointement/DateTimeSection';
import { Patient } from '@/types/patient.type';

export default function NewAppointementByDoctorContent() {
  const [params] = useSearchParams();
  const doctorIdString = params.get('doctor') ?? '';
  const doctorId = doctorIdString ? parseInt(doctorIdString, 10) : undefined;

  const { selectedDay, handleSelectedDay, SaveAppointment, handleAppointment } =
    useAppointmentContext();

  const {
    data: doctorData,
    loading: doctorLoading,
    error: doctorError,
  } = useGetUserByIdQuery({
    variables: { id: doctorIdString },
    skip: !doctorIdString,
  });

  const { data: appointmentTypesData } = useGetAppointmentTypesQuery();
  const consultationOptions = [
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

  const disabledTimes = getDisabledTimes(selectedDay, appointments, generateTimeOptions());

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const doctor: GetUserByIdQuery['getUserById'] | undefined = doctorData?.getUserById;

  if (doctorLoading) return <p>Chargement...</p>;
  if (doctorError) return <p>Erreur lors du chargement du médecin.</p>;

  return (
    <>
      <div className="flex flex-col w-3/4">
        <section className="flex flex-col gap-4 self-start">
          {doctor && <DoctorInfo doctor={doctor} />}
        </section>
      </div>

      <section className="bg-bgBodyColor md:w-3/4 p-4 sm:p-6 md:p-12 lg:p-24 rounded-sm shadow-md border-borderColor flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 lg:gap-14 xl:gap-10">
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

        <section className="flex flex-col gap-4">
          <PatientSearch
            selectedPatient={selectedPatient}
            setSelectedPatient={setSelectedPatient}
          />

          <SelectForm
            name="appointmentType"
            value={SaveAppointment.appointmentType}
            title="Motif de consultation"
            option={consultationOptions}
            handle={handleAppointment}
          />

          <DateTimeSection disabledTimes={disabledTimes} />
        </section>
      </section>
    </>
  );
}
