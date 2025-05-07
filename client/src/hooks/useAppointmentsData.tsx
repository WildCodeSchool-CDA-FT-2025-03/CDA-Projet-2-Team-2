import calendarEventsData from '@/fakeData/calendarEventsData.json';
import { Appointment } from '@/types/CalendarEvent.type';

const useAppointmentsData = (): Appointment[] => {
  return calendarEventsData.map((appointment: Appointment) => {
    const localStart = new Date(appointment.start_time + 'Z');
    const [hours, minutes] = appointment.duration.split(':').map(Number);
    const localEnd = new Date(localStart.getTime() + hours * 60 * 60 * 1000 + minutes * 60 * 1000);

    return {
      ...appointment,
      start_time: localStart.toISOString(),
      end_time: localEnd.toISOString(),
    };
  });
};

export default useAppointmentsData;
