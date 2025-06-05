import { ReactNode, useMemo, useEffect, useState, useCallback } from 'react';
import { AppointmentContext, AppointmentContextType } from './AppointmentContext';
import { DayPilot } from '@daypilot/daypilot-lite-react';
import { useSearchParams } from 'react-router-dom';
import { PatientAppointment } from '@/types/appointement.type';

export function CreateAppointmentContext({ children }: { children: ReactNode }) {
  const DEFAULT_DEPARTMENT = '1';
  const [selectedDepartment, handleSelectedDepartment] = useState(DEFAULT_DEPARTMENT);
  const [params] = useSearchParams();

  const [savePatient, setSavePatient] = useState<PatientAppointment>({
    user_id: '',
    date: '',
    start: '',
    end: '',
    appointmentType: '',
  });

  const [selectedDay, handleSelectedDay] = useState<DayPilot.Date>(
    new DayPilot.Date(DayPilot.Date.today()), // valeur par défaut = aujourd'hui
  );

  useEffect(() => {
    const dateParam = params.get('date');
    if (dateParam) {
      const [fullDate, timePart] = dateParam.split('T');

      // ✅ Mettre la date (YYYY-MM-DD) dans DayPilot.Date
      handleSelectedDay(new DayPilot.Date(fullDate));
      setSavePatient(prev => ({
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
        setSavePatient(prev => ({
          ...prev,
          start: hourMinute,
          end: `${endHour}:${endMinute}`,
        }));
      }
    }
  }, [params]);

  const handleStartChange = useCallback((value: string) => {
    const [hour, minute] = value.split(':').map(Number);
    const newDate = new Date();
    newDate.setHours(hour, minute + 30);
    const endHour = newDate.getHours().toString().padStart(2, '0');
    const endMinute = newDate.getMinutes().toString().padStart(2, '0');
    setSavePatient(prev => ({
      ...prev,
      start: value,
      end: `${endHour}:${endMinute}`,
    }));
  }, []);

  const handleDoctorChange = useCallback((value: string) => {
    setSavePatient(prev => ({
      ...prev,
      user_id: value,
    }));
  }, []);

  const handleAppointment = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSavePatient(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const contextValue = useMemo<AppointmentContextType>(
    () => ({
      selectedDepartment,
      selectedDay,
      savePatient,
      handleSelectedDepartment,
      handleDoctorChange,
      handleStartChange,
      handleAppointment,
      handleSelectedDay,
    }),
    [
      selectedDepartment,
      selectedDay,
      savePatient,
      handleSelectedDepartment,
      handleDoctorChange,
      handleStartChange,
      handleAppointment,
      handleSelectedDay,
    ],
  );
  return <AppointmentContext.Provider value={contextValue}>{children}</AppointmentContext.Provider>;
}

export { AppointmentContext };
export type { AppointmentContextType };
