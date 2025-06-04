import { ReactNode, useMemo, useEffect, useState, useCallback } from 'react';
import { AppointmentContext, AppointmentContextType } from './AppointmentContext';
import { DayPilot } from '@daypilot/daypilot-lite-react';
import { useSearchParams } from 'react-router-dom';
import { PatientAppointment } from '@/types/appointement.type';

export function CreateAppointmentContext({ children }: { children: ReactNode }) {
  const DEFAULT_DEPARTMENT = '1';
  const [selectedDepartment, setSelectedDepartment] = useState(DEFAULT_DEPARTMENT);
  const [params] = useSearchParams();

  const [savePatient, setSavePatient] = useState<PatientAppointment>({
    user_id: '',
    date: '',
    start: '',
    end: '',
    appointmentType: '',
  });

  const [selectedDay, setSelectedDay] = useState<DayPilot.Date>(
    new DayPilot.Date(DayPilot.Date.today()), // valeur par défaut = aujourd'hui
  );
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    const dateParam = params.get('date');
    if (dateParam) {
      const [fullDate, timePart] = dateParam.split('T');

      // ✅ Mettre la date (YYYY-MM-DD) dans DayPilot.Date
      setSelectedDay(new DayPilot.Date(fullDate));

      // ✅ Si l'heure est présente, on la traite
      if (timePart) {
        const hourMinute = timePart.slice(0, 5); // "14:00"
        setStartTime(hourMinute);

        // Calcul automatique de fin (+30 min)
        const [hour, minute] = hourMinute.split(':').map(Number);
        const end = new Date();
        end.setHours(hour, minute + 30);
        const endHour = end.getHours().toString().padStart(2, '0');
        const endMinute = end.getMinutes().toString().padStart(2, '0');
        setEndTime(`${endHour}:${endMinute}`);
        setSavePatient(prev => ({
          ...prev,
          date: fullDate,
        }));
      }
    }
  }, [params]);

  const handleStartChange = useCallback((value: string) => {
    setStartTime(value);
    const [hour, minute] = value.split(':').map(Number);
    const newDate = new Date();
    newDate.setHours(hour, minute + 30);
    const endHour = newDate.getHours().toString().padStart(2, '0');
    const endMinute = newDate.getMinutes().toString().padStart(2, '0');
    setEndTime(`${endHour}:${endMinute}`);
    setSavePatient(prev => ({
      ...prev,
      start: value,
      end: `${endHour}:${endMinute}`,
    }));
  }, []);

  const HandleAppointment = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
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
      startTime,
      endTime,
      savePatient,
      setSavePatient,
      setStartTime,
      setSelectedDepartment,
      handleStartChange,
      HandleAppointment,
      setSelectedDay,
    }),
    [
      selectedDepartment,
      selectedDay,
      startTime,
      endTime,
      savePatient,
      setSavePatient,
      setStartTime,
      setSelectedDepartment,
      handleStartChange,
      HandleAppointment,
      setSelectedDay,
    ],
  );
  return <AppointmentContext.Provider value={contextValue}>{children}</AppointmentContext.Provider>;
}

export { AppointmentContext };
export type { AppointmentContextType };
