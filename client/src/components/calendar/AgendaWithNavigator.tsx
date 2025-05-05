import { useState, useEffect } from 'react';
import ressourcesData from '../../fakeData/ressourcesData.json';
import calendarEventsData from '../../fakeData/calendarEventsData.json';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from '@daypilot/daypilot-lite-react';
import { Resource } from '@/types/resource.type';
import { Appointment } from '@/types/CalendarEvent.type';

const AgendaWithNavigator = () => {
  const [startDate, setStartDate] = useState<DayPilot.Date>(DayPilot.Date.today());
  const [resources, setResources] = useState<Resource[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    setResources(ressourcesData as Resource[]);

    const convertedAppointments: Appointment[] = calendarEventsData.map(
      (appointment: Appointment) => {
        // 💡Creates a local date (avoids time differences)
        const localStart = new Date(appointment.start_time + 'Z'); // ⚠️Add 'Z' to force UTC

        const [hours, minutes] = appointment.duration.split(':').map(Number);
        const localEnd = new Date(
          localStart.getTime() + hours * 60 * 60 * 1000 + minutes * 60 * 1000,
        );

        return {
          ...appointment,
          start_time: localStart.toISOString(),
          end_time: localEnd.toISOString(),
        };
      },
    );

    setAppointments(convertedAppointments);
  }, []);

  return (
    <div className="flex gap-6 p-6">
      <DayPilotNavigator
        selectMode="Day"
        showMonths={1}
        skipMonths={1}
        onTimeRangeSelected={args => setStartDate(args.day)}
      />
      <DayPilotCalendar
        viewType="Resources"
        startDate={startDate}
        businessBeginsHour={9}
        businessEndsHour={19}
        columns={resources.map(resource => ({
          name: resource.name,
          id: resource.id,
          html: `
            <div class="flex items-center gap-3 p-2">
              <img src="${resource.avatar}" alt="${resource.name}" class="w-8 h-8 rounded-full object-cover" />
              <div>
                <div class="text-sm font-semibold text-blue">${resource.name}</div>
                <div class="text-xs text-gray-400">${resource.speciality}</div>
              </div>
            </div>
          `,
        }))}
        events={appointments.map(event => ({
          id: event.id,
          text: event.patient_name,
          html: `
          <div style="background-color: #e2e8f0;">
              <p class="text-xs font-semibold">${event.patient_name}</p>
              <p class="text-xs text-gray-600">${event.appointment_type}</p>
          </div>
        `,
          start: new DayPilot.Date(event.start_time),
          end: new DayPilot.Date(event.end_time),
          resource: event.doctor_id,
        }))}
      />
    </div>
  );
};

export default AgendaWithNavigator;
