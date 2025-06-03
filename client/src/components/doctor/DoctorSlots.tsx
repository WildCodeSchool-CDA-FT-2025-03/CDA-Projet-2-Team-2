import { useState } from 'react';
import {
  DoctorAppointmentSlot,
  useGetDoctorSlotByDepartementLazyQuery,
} from '@/types/graphql-generated';
import DepartmentSelect from '@/components/form/DepartmentSelect';
import { DayPilot } from '@daypilot/daypilot-lite-react';
import { PatientAppointment } from '@/types/appointement.type';

type DoctorSlotsProps = {
  setSelectedDepartment: (value: string) => void;
  setStartTime: (value: string) => void;
  setSavePatient: (value: PatientAppointment) => void;
  handleStartChange: (value: string) => void;
  selectedDepartment: string;
  selectedDay: DayPilot.Date;
  savePatient: PatientAppointment;
};

export default function DoctorSlots({
  setSelectedDepartment,
  setStartTime,
  setSavePatient,
  handleStartChange,
  selectedDepartment,
  selectedDay,
  savePatient,
}: DoctorSlotsProps) {
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState<DoctorAppointmentSlot[]>([]);
  const [GetDoctorSlotByDepartement] = useGetDoctorSlotByDepartementLazyQuery();

  const checkDoctorAvailability = async () => {
    setLoading(true);
    const { data } = await GetDoctorSlotByDepartement({
      variables: {
        departementId: parseInt(selectedDepartment),
        date: selectedDay.toDate().toDateString(),
      },
    });
    setLoading(false);

    const slots = data?.getDoctorSlotByDepartement || [];
    if (slots.length === 0) {
      alert('Aucun rendez-vous disponible pour cette date et ce département.');
      return;
    }
    setSlots(slots as DoctorAppointmentSlot[]);
  };

  const handleSlotClick = (slot: DoctorAppointmentSlot) => {
    setStartTime(slot.debut_libre.split(':').slice(0, 2).join(':'));
    handleStartChange(slot.debut_libre.split(':').slice(0, 2).join(':'));
    setSavePatient({ ...savePatient, user_id: slot.id.toString() });
  };

  return (
    <>
      <section className="flex flex-col md:flex-row lg:justify-between md:items-center gap-4 mb-0">
        <div className="flex justify-center lg:justify-start w-full">
          <DepartmentSelect
            value={selectedDepartment}
            onChange={newLabel => {
              setSelectedDepartment(newLabel);
            }}
          />
        </div>
        <div className="flex justify-center md:justify-end w-full">
          <div className="w-full max-w-xs">
            <button
              className="w-full bg-blue text-white rounded-md px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => {
                checkDoctorAvailability();
              }}
            >
              Prochains rendez-vous disponibles
            </button>
          </div>
        </div>
      </section>
      {loading && (
        <section className="flex flex-col gap-4 mb-1 sm:w-full md:w-3/4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500"></div>
        </section>
      )}
      {slots.length > 0 && (
        <section className="flex flex-col gap-4 mb-1 sm:w-full md:w-3/4">
          <div className="flex flex-col gap-2">
            {Object.entries(
              slots.reduce(
                (acc, slot) => {
                  const key = `${slot.firstname} ${slot.lastname}`;
                  if (!acc[key]) {
                    acc[key] = [];
                  }
                  acc[key].push(slot);
                  return acc;
                },
                {} as Record<string, typeof slots>,
              ),
            ).map(([name, slotsForPerson]) => (
              <div key={name}>
                <h4 className="font-medium">{name}</h4>
                <ul className="list-disc pl-6">
                  {slotsForPerson.map(slot => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => handleSlotClick(slot)}
                      className="inline-block bg-white text-black text-sm px-3 py-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 m-2 p-2"
                      aria-label={`Sélectionner le créneau de ${slot.debut_libre} à ${slot.fin_libre}`}
                    >
                      {slot.debut_libre} - {slot.fin_libre}
                    </button>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
