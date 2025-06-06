import { ReactNode, useMemo, useEffect, useState, useCallback } from 'react';
import { AppointmentContext, AppointmentContextType } from './AppointmentContext';
import { DayPilot } from '@daypilot/daypilot-lite-react';
import { useSearchParams, useMatch } from 'react-router-dom';
import { PatientAppointment } from '@/types/appointement.type';
import { useCreateAppointmentMutation } from '@/types/graphql-generated';

export function CreateAppointmentContext({ children }: { children: ReactNode }) {
  const patientMatch = useMatch('/secretary/patient/:id/appointment/create');
  const doctorMatch = useMatch('/secretary/doctor/:id/appointment/create');
  const [createAppointment] = useCreateAppointmentMutation();
  const DEFAULT_DEPARTMENT = '1';
  const [selectedDepartment, handleSelectedDepartment] = useState(DEFAULT_DEPARTMENT);
  const [params] = useSearchParams();

  const [SaveAppointment, setSaveAppointment] = useState<PatientAppointment>({
    user_id: '',
    date: '',
    start: '',
    end: '',
    appointmentType: '',
    patient_id: '',
  });

  const [selectedDay, handleSelectedDay] = useState<DayPilot.Date>(
    new DayPilot.Date(DayPilot.Date.today()), // valeur par défaut = aujourd'hui
  );

  /**
   * fonction pour changer une valeur de SaveAppointment. utile dans le cas ou on change hors formulaire
   * @value : la valeur à insérer
   * @name : l'élément a modifier
   */
  const handleTypeChange = useCallback((value: string, name: string) => {
    setSaveAppointment(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  /**
   * fonction pour vérifier sur quelle URL ont est. Si on arrive d'un patient on initialise l'id du patient de SaveAppointment
   * et si on arrive de docteur on initialise l'id du docteur 'user_id'
   */
  const checkURL = useCallback(() => {
    if (patientMatch && patientMatch.params.id) {
      handleTypeChange(patientMatch.params.id, 'patient_id');
    } else if (doctorMatch && doctorMatch.params.id) {
      handleTypeChange(doctorMatch.params.id, 'user_id');
    }
  }, [patientMatch, doctorMatch, handleTypeChange]);

  /**
   * fonction qui met à jour si une date est passé en paramètre. Utile surtout si on vient de l'url docteur
   */
  const checkDateCalendar = useCallback(() => {
    const dateParam = params.get('date');
    if (dateParam) {
      const [fullDate, timePart] = dateParam.split('T');

      // ✅ Mettre la date (YYYY-MM-DD) dans DayPilot.Date
      handleSelectedDay(new DayPilot.Date(fullDate));
      setSaveAppointment(prev => ({
        ...prev,
        date: fullDate,
      }));

      // ✅ Si l'heure est présente, on la traite
      if (timePart) {
        const hourMinute = timePart.slice(0, 5); // "14:00"
        // Calcul automatique de fin (+30 min)
        const [hour, minute] = hourMinute.split(':').map(Number);
        const endDate = new Date();
        endDate.setHours(hour, minute + 30);
        const endHour = endDate.getHours().toString().padStart(2, '0');
        const endMinute = endDate.getMinutes().toString().padStart(2, '0');
        setSaveAppointment(prev => ({
          ...prev,
          start: hourMinute,
          end: `${endHour}:${endMinute}`,
        }));
      }
    }
  }, [params]);

  useEffect(() => {
    checkURL();
    checkDateCalendar();
  }, [checkDateCalendar, checkURL]);

  /**
   * fonction de calcul automatique de l'heure de fin du rendez-vous lorsque on change l'heure de début
   * @value : heure de début
   */
  const handleStartChange = useCallback((value: string) => {
    const [hour, minute] = value.split(':').map(Number);
    const newDate = new Date();
    newDate.setHours(hour, minute + 30);
    const endHour = newDate.getHours().toString().padStart(2, '0');
    const endMinute = newDate.getMinutes().toString().padStart(2, '0');
    setSaveAppointment(prev => ({
      ...prev,
      start: value,
      end: `${endHour}:${endMinute}`,
    }));
  }, []);

  /**
   * fonction de modification d'une form element
   */
  const handleAppointment = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSaveAppointment(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  /**
   * fonction pour enregistrer un formulaire
   */
  const handleSubmitAppointment = useCallback(async () => {
    // Logique de soumission du formulaire
    const timedebut = SaveAppointment.start;
    const timefin = SaveAppointment.end;
    const [hour1, minute1] = timedebut.split(':').map(Number);
    const [hour2, minute2] = timefin.split(':').map(Number);
    const minutesDifference = (hour2 - hour1) * 60 + (minute2 - minute1);
    const { errors, data: dataSaveAppointment } = await createAppointment({
      variables: {
        appointmentInput: {
          user_id: SaveAppointment.user_id,
          start_time: selectedDay.toString().split('T')[0] + 'T' + SaveAppointment.start + ':00',
          departement: selectedDepartment,
          duration: minutesDifference,
          appointmentType: SaveAppointment.appointmentType,
          patient_id: SaveAppointment.patient_id, // Assurez-vous que l'ID est défini ou initialisé
          created_by: '50', // ID de l'utilisateur qui crée le rendez-vous
        },
      },
    });
    if (!dataSaveAppointment || errors) {
      throw new Error('Erreur lors de la création du rendez-vous');
    }
  }, [SaveAppointment, createAppointment, selectedDepartment, selectedDay]);

  const contextValue = useMemo<AppointmentContextType>(
    () => ({
      selectedDepartment,
      selectedDay,
      SaveAppointment,
      handleSelectedDepartment,
      handleTypeChange,
      handleStartChange,
      handleAppointment,
      handleSelectedDay,
      handleSubmitAppointment,
    }),
    [
      selectedDepartment,
      selectedDay,
      SaveAppointment,
      handleSelectedDepartment,
      handleTypeChange,
      handleStartChange,
      handleAppointment,
      handleSelectedDay,
      handleSubmitAppointment,
    ],
  );
  return <AppointmentContext.Provider value={contextValue}>{children}</AppointmentContext.Provider>;
}

export { AppointmentContext };
export type { AppointmentContextType };
