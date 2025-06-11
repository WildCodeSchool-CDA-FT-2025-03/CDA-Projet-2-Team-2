import { FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppointmentContext } from '@/hooks/useAppointment';
import PatientSearch from '@/components/appointement/PatientSearch';
import SelectForm from '@/components/form/SelectForm';
import DateTimeSection from '@/components/appointement/DateTimeSection';
import { generateTimeOptions } from '@/utils/generatedTimeOptions';
import { getDisabledTimes } from '@/utils/getAppointementTimeStartDisabled';
import { Patient } from '@/types/patient.type';

type FormAppointementDoctorProps = {
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
  appointmentTypes: { key: string; value: string }[];
  appointments: { start_time: string; duration: number }[];
};

export default function FormAppointementDoctor({
  selectedPatient,
  setSelectedPatient,
  appointmentTypes,
  appointments,
}: FormAppointementDoctorProps) {
  const navigate = useNavigate();
  const {
    SaveAppointment,
    handleAppointment,
    handleSubmitAppointment,
    selectedDay,
    handleTypeChange,
  } = useAppointmentContext();

  const disabledTimes = getDisabledTimes(selectedDay, appointments, generateTimeOptions());

  // 💡 Met à jour SaveAppointment.patient_id dès qu’on sélectionne un patient
  useEffect(() => {
    if (selectedPatient?.id) {
      handleTypeChange(selectedPatient.id, 'patient_id');
    }
  }, [selectedPatient, handleTypeChange]);

  const handleSubmitInfo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPatient || !SaveAppointment.start) {
      alert('Veuillez sélectionner un patient et un horaire.');
      return;
    }

    if (!SaveAppointment.patient_id) {
      alert('Aucun patient sélectionné. Impossible de créer le rendez-vous.');
      return;
    }

    try {
      await handleSubmitAppointment();
      alert('Rendez-vous créé avec succès !');
      navigate('/secretary');
    } catch (error) {
      console.error('Erreur lors de la création du rendez-vous :', error);
      alert('Erreur lors de la création.');
    }
  };

  return (
    <form onSubmit={handleSubmitInfo} className="flex flex-col gap-4 w-full">
      <PatientSearch selectedPatient={selectedPatient} setSelectedPatient={setSelectedPatient} />

      <SelectForm
        name="appointmentType"
        value={SaveAppointment.appointmentType}
        title="Motif de consultation"
        option={appointmentTypes}
        handle={handleAppointment}
      />

      <DateTimeSection disabledTimes={disabledTimes} />

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Créer le rendez-vous
      </button>
    </form>
  );
}
