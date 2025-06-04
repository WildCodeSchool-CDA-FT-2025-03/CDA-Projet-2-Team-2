import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DayPilot, DayPilotNavigator } from '@daypilot/daypilot-lite-react';
import {
  useSearchPatientsQuery,
  useGetAppointmentTypesQuery,
  useGetAppointmentsByDoctorAndDateQuery,
} from '@/types/graphql-generated';
import { Patient } from '@/types/patient.type';
import { Doctor } from '@/types/doctor.type';
import { getDisabledTimes, AppointmentSlot } from '@/utils/getAppointementTimeStartDisabled';
import { generateTimeOptions } from '@/utils/generatedTimeOptions';
import SelectForm from '@/components/form/SelectForm';
import DoctorInfo from '@/components/appointement/DoctorInfo';
import PatientSearch from '@/components/appointement/PatientSearch';
import DateTimeSection from '@/components/appointement/DateTimeSection';
import UserItem from '@/components/user/UserItem';

export default function NewAppointementByDoctor() {
  const [params] = useSearchParams();
  const [selectedDay, setSelectedDay] = useState<DayPilot.Date>(
    new DayPilot.Date(DayPilot.Date.today()),
  );
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const {
    data: patientData,
    loading: loadingPatients,
    error: errorPatients,
  } = useSearchPatientsQuery({
    variables: { query: searchQuery },
    skip: searchQuery.length < 2,
  });

  const searchSources = [
    {
      name: 'Patients',
      items: patientData?.searchPatients ?? [],
      loading: loadingPatients,
      error: errorPatients ? errorPatients.message : null,
      getKey: (patient: Patient) => `patient-${patient.id}`,
    },
  ];

  const { data: appointmentTypesData } = useGetAppointmentTypesQuery();
  const consultationOptions = [
    { key: '', value: '--- Choisissez un motif' },
    ...(appointmentTypesData?.getAppointmentTypes.map(type => ({
      key: type.id,
      value: type.reason,
    })) ?? []),
  ];

  const doctorId = Number(params.get('doctor'));
  const { data: appointmentsData } = useGetAppointmentsByDoctorAndDateQuery({
    variables: { doctorId, date: selectedDay.toString().slice(0, 10) },
    skip: !doctorId || !selectedDay,
  });

  const appointments: AppointmentSlot[] =
    appointmentsData?.getAppointmentsByDoctorAndDate.map(appt => ({
      start_time: appt.start_time,
      duration: appt.duration,
    })) ?? [];

  const disabledTimes = getDisabledTimes(selectedDay, appointments, generateTimeOptions());

  const handleStartChange = (value: string) => {
    setStartTime(value);
    const [hour, minute] = value.split(':').map(Number);
    const newDate = new Date();
    newDate.setHours(hour, minute + 30);
    setEndTime(
      `${newDate.getHours().toString().padStart(2, '0')}:${newDate.getMinutes().toString().padStart(2, '0')}`,
    );
  };

  useEffect(() => {
    const dateParam = params.get('date');
    if (dateParam) {
      const [fullDate, timePart] = dateParam.split('T');
      setSelectedDay(new DayPilot.Date(fullDate));
      if (timePart) {
        const hourMinute = timePart.slice(0, 5);
        setStartTime(hourMinute);
        const [hour, minute] = hourMinute.split(':').map(Number);
        const end = new Date();
        end.setHours(hour, minute + 30);
        setEndTime(
          `${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`,
        );
      }
    }
  }, [params]);

  const doctorMock: Doctor = {
    id: '123',
    firstname: 'Emilie',
    lastname: 'Masser',
    profession: 'Pedospsychiatre',
    departement: { label: 'Pédiatrie' },
  };

  return (
    <>
      <DoctorInfo doctor={doctorMock} />

      <section
        className="bg-bgBodyColor
       w-full sm:w-[80%] max-w-screen-lg 
    p-4 sm:p-6 md:p-12 lg:p-24
    rounded-sm shadow-md border-borderColor
    m-auto
  

  "
      >
        <div
          className="
    flex flex-col lg:flex-row
      w-full
      justify-center items-center
      space-y-4  gap-10
  "
        >
          <aside>
            <DayPilotNavigator
              selectMode="Day"
              showMonths={1}
              skipMonths={1}
              locale="fr-fr"
              selectionDay={selectedDay}
              onTimeRangeSelected={args => setSelectedDay(args.day)}
            />
          </aside>

          <section
            className=" flex flex-col gap-2
        w-full 
        lg:w-max justify-center items-center
  "
          >
            <div className="flex flex-col gap-4 max-w-[375px] w-full">
              <UserItem<Doctor> user={doctorMock}>
                {d => (
                  <p>
                    <span className="font-bold">
                      {d.firstname} {d.lastname}
                    </span>{' '}
                    - {d.departement?.label ?? 'service'}
                  </p>
                )}
              </UserItem>

              <PatientSearch
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                searchSources={searchSources}
                selectedPatient={selectedPatient}
                setSelectedPatient={setSelectedPatient}
              />

              <SelectForm
                name="motifs"
                value=""
                title="Motif de consultation"
                option={consultationOptions}
                handle={value => console.warn('Motif sélectionné :', value)}
              />

              <DateTimeSection
                selectedDay={selectedDay}
                startTime={startTime}
                handleStartChange={handleStartChange}
                endTime={endTime}
                disabledTimes={disabledTimes}
              />
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
