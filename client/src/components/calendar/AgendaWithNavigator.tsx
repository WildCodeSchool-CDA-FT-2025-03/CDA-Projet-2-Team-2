import { useState, useEffect } from 'react';
// import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import ressourcesData from '../../fakeData/ressourcesData.json';
import calendarEventsData from '../../fakeData/calendarEventsData.json';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from '@daypilot/daypilot-lite-react';
import { Resource } from '@/types/resource.type';
import { CalendarEvent } from '@/types/CalendarEvent.type';

const AgendaWithNavigator = () => {
  const [startDate, setStartDate] = useState<DayPilot.Date>(DayPilot.Date.today());
  const [resources, setResources] = useState<Resource[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    setResources(ressourcesData as Resource[]);

    const convertedEvents: CalendarEvent[] = calendarEventsData.map(event => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    }));

    setEvents(convertedEvents);
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
        columns={resources.map(resource => ({
          name: resource.name,
          id: resource.id,
          html: `<div class="flex items-center gap-1" style="height: 50px;"><img class="w-8 h-8" src="/doctoplan-logo.svg" /><span>${resource.name}</span></div>`,
        }))}
        events={events.map(event => ({
          id: event.id,
          text: event.text,
          start: new DayPilot.Date(event.start),
          end: new DayPilot.Date(event.end),
          resource: event.resource,
        }))}
      />
    </div>
  );
};

export default AgendaWithNavigator;
