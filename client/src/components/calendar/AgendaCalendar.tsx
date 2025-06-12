import { DayPilot, DayPilotCalendar } from '@daypilot/daypilot-lite-react';
import { roundStartToNextHalfHour } from '@/utils/roundStartToNextHalfHour';
import type { Appointment } from '@/types/CalendarEvent.type';
import { RefObject } from 'react';

type AgendaCalendarProps = {
  calendarRef: RefObject<DayPilotCalendar | null>;
  startDate: DayPilot.Date;
  appointments: Appointment[];
  visibleResources: {
    id: string | number;
    name: string;
    avatar: string;
    speciality: string;
  }[];
  onEventClick: (args: { e: { data: Appointment } }) => void;
  onTimeRangeSelected: (args: {
    start: DayPilot.Date;
    end: DayPilot.Date;
    resource: string | number;
  }) => void;
};

export default function AgendaCalendar({
  calendarRef,
  startDate,
  appointments,
  visibleResources,
  onEventClick,
  onTimeRangeSelected,
}: AgendaCalendarProps) {
  return (
    <article className="flex-1" aria-label="Agenda de tous les médecins et leurs rendez-vous">
      <DayPilotCalendar
        ref={calendarRef}
        viewType="Resources"
        startDate={startDate}
        timeFormat="Clock24Hours"
        locale="fr-fr"
        columns={visibleResources.map(resource => ({
          name: resource.name,
          id: resource.id,
          html: `
            <div class="flex items-center gap-3 p-2">
              <img src="${resource.avatar}" alt="${resource.name}" class="w-8 h-8 object-cover" />
              <div>
                <div class="text-sm font-semibold text-blue">${resource.name}</div>
                <div class="text-xs text-gray-400">${resource.speciality}</div>
              </div>
            </div>
          `,
        }))}
        events={appointments.map(event => {
          const doctorId = event.doctor_id;
          const snappedStart = roundStartToNextHalfHour(event.start_time);
          const snappedEnd = new Date(snappedStart);
          snappedEnd.setMinutes(snappedStart.getMinutes() + 30);

          return {
            id: event.id,
            text: event.patient_name,
            html: `
              <div style="background-color: #e2e8f0; line-height:1.2;">
                <p style="font-weight: 600; font-size: 11px;">${event.patient_name}</p>
                <p style="color: #4b5563; font-size: 10px;">
                  ${event.appointment_type}
                  <span class="text-xs text-gray-400">Début: ${event.start_time.slice(11, 16)}</span>
                </p>
              </div>
            `,
            start: new DayPilot.Date(snappedStart.toISOString()),
            end: new DayPilot.Date(snappedEnd.toISOString()),
            resource: doctorId,
          };
        })}
        onEventClick={onEventClick}
        onTimeRangeSelected={onTimeRangeSelected}
      />
    </article>
  );
}
