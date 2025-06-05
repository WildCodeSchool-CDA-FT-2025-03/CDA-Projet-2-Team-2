import { createContext } from 'react';
import { DayPilot } from '@daypilot/daypilot-lite-react';
import { PatientAppointment } from '@/types/appointement.type';

export type AppointmentContextType = {
  selectedDepartment: string;
  selectedDay: DayPilot.Date;
  savePatient: PatientAppointment;
  handleSelectedDepartment: (value: string) => void;
  handleStartChange: (value: string) => void;
  handleDoctorChange: (value: string) => void;
  handleAppointment: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSelectedDay: (value: DayPilot.Date) => void;
};

export const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);
