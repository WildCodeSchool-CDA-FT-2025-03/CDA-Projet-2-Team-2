import { useState } from 'react';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from '@daypilot/daypilot-lite-react';
import ressourcesData from '@/fakeData/ressourcesData.json';
import { Resource } from '@/types/resource.type';
import useResponsiveAgendaPageSize from '@/hooks/useResponsiveAgendaPageSize';
import useAppointmentsData from '@/hooks/useAppointmentsData';
import PaginationControls from './PaginationControls';

function AgendaWithNavigator() {
  const [startDate, setStartDate] = useState<DayPilot.Date>(DayPilot.Date.today());
  const [resources] = useState<Resource[]>(ressourcesData);
  const appointments = useAppointmentsData();
  const pageSize = useResponsiveAgendaPageSize();
  const [currentPage, setCurrentPage] = useState(0);

  const visibleResources = resources.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  return (
    <div
      className="py-6 px-6 md:px-24"
      role="region"
      aria-label="Agenda de tous les professionnnels du service"
    >
      {/* Pagination desktop */}
      <div
        className="hidden lg:flex justify-end items-center gap-4 mb-4"
        aria-label="Pagination desktop"
      >
        <PaginationControls
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          totalItems={resources.length}
        />
      </div>

      <section className="flex flex-col lg:flex-row gap-10 mt-6">
        {/* Calendar navigator */}
        <aside aria-label="Navigateur de date">
          <DayPilotNavigator
            selectMode="Day"
            showMonths={1}
            skipMonths={1}
            locale="fr-fr"
            onTimeRangeSelected={args => setStartDate(args.day)}
          />
        </aside>

        {/* Pagination mobile */}
        <div className="lg:hidden" aria-label="Pagination mobile">
          <PaginationControls
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            pageSize={pageSize}
            totalItems={resources.length}
            className="mb-4"
          />
        </div>

        {/* Agenda */}
        <article className="flex-1" aria-label="Agenda de tous les medecins et leurs rendez-vous">
          <DayPilotCalendar
            viewType="Resources"
            startDate={startDate}
            timeFormat="Clock24Hours"
            locale="fr-fr"
            columns={visibleResources.map(resource => ({
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
        </article>
      </section>
    </div>
  );
}

export default AgendaWithNavigator;
