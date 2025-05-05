export interface Appointment {
  id: string;
  patient_name: string;
  start_time: string;
  duration: string;
  end_time?: string;
  profesional_name: string;
  statut: string;
  appointment_type: string;
}
