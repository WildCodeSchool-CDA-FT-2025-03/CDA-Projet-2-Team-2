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
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 530) {
        setPageSize(1);
      } else if (window.innerWidth < 650) {
        setPageSize(2);
      } else if (window.innerWidth < 1200) {
        setPageSize(3);
      } else {
        setPageSize(4);
      }
    };
    handleResize();

    window.addEventListener('resize', handleResize);

    setResources(ressourcesData as Resource[]);

    const convertedAppointments: Appointment[] = calendarEventsData.map(
      (appointment: Appointment) => {
        const localStart = new Date(appointment.start_time + 'Z');
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

    // Nettoyage de l'événement lors du démontage du composant
    return () => window.removeEventListener('resize', handleResize);
  }, []); // [] pour n'exécuter cet effet qu'une seule fois au montage du composant

  // Calcul des ressources visibles selon la pagination
  const visibleResources = resources.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  return (
    <div className="py-6 px-6 md:px-24">
      {/* Flèches de navigation - Positionnées au-dessus du calendrier en mode large (écran plus large) */}
      <div className="hidden lg:flex justify-end items-center gap-4 mb-4 lg:mb-0">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
          className="text-blue rounded disabled:opacity-50 cursor-pointer"
        >
          ◀
        </button>
        <span>
          {currentPage * pageSize + 1} à {Math.min((currentPage + 1) * pageSize, resources.length)}
          sur {resources.length}
        </span>
        <button
          onClick={() =>
            setCurrentPage(prev => ((prev + 1) * pageSize < resources.length ? prev + 1 : prev))
          }
          disabled={(currentPage + 1) * pageSize >= resources.length}
          className="text-blue rounded disabled:opacity-50 cursor-pointer"
        >
          ▶
        </button>
      </div>
      <div className="flex flex-col lg:flex-row gap-10 mt-6">
        <div>
          <DayPilotNavigator
            selectMode="Day"
            showMonths={1}
            skipMonths={1}
            locale="fr-fr"
            onTimeRangeSelected={args => setStartDate(args.day)}
          />
        </div>

        {/* Flèches de navigation - Positionnées entre Navigator et Calendar en mode colonne (mobile) */}
        <div className="flex justify-between items-center gap-4 mb-4 lg:mb-0 lg:hidden">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
            className="text-blue rounded disabled:opacity-50 cursor-pointer"
          >
            ◀
          </button>
          <span>
            {currentPage * pageSize + 1} à{' '}
            {Math.min((currentPage + 1) * pageSize, resources.length)} sur {resources.length}
          </span>
          <button
            onClick={() =>
              setCurrentPage(prev => ((prev + 1) * pageSize < resources.length ? prev + 1 : prev))
            }
            disabled={(currentPage + 1) * pageSize >= resources.length}
            className="text-blue rounded disabled:opacity-50 cursor-pointer"
          >
            ▶
          </button>
        </div>
        <div className="flex-1">
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
        </div>
      </div>
    </div>
  );
};

export default AgendaWithNavigator;
