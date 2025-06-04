import { createContext } from 'react';
import { DayPilot } from '@daypilot/daypilot-lite-react';
import { PatientAppointment } from '@/types/appointement.type';

export type AppointmentContextType = {
  selectedDepartment: string;
  selectedDay: DayPilot.Date;
  startTime: string;
  endTime: string;
  savePatient: PatientAppointment;
  setSavePatient: (value: PatientAppointment) => void;
  setSelectedDepartment: (value: string) => void;
  handleStartChange: (value: string) => void;
  HandleAppointment: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  setStartTime: (value: string) => void;
  setSelectedDay: (value: DayPilot.Date) => void;
};

export const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);
