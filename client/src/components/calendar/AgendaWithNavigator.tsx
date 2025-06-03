import { useMemo, useState } from 'react';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from '@daypilot/daypilot-lite-react';
import useAppointmentsData from '@/hooks/useAppointmentsData';
import useResponsiveAgendaPageSize from '@/hooks/useResponsiveAgendaPageSize';
import PaginationControls from './PaginationControls';
import useResources from '@/hooks/useResources';
import DepartmentSelect from '@/components/form/DepartmentSelect';
import SearchBar from '@/components/form/SearchBar';
import type { Appointment } from '@/types/CalendarEvent.type';
import { roundStartToNextHalfHour } from '@/utils/roundStartToNextHalfHour';
import ConfirmationModal from '../modals/ConfirmationModal';
import { useNavigate } from 'react-router-dom';

type EventClickArgs = {
  e: {
    data: {
      id: string;
      text: string;
      start: DayPilot.Date;
      end: DayPilot.Date;
      resource: string | number;
      patient_name: string;
      appointment_type: string;
      [key: string]: unknown;
    };
  };
};

export default function AgendaWithNavigator() {
  const DEFAULT_DEPARTMENT = 'Cardiologie';
  const [startDate, setStartDate] = useState<DayPilot.Date>(DayPilot.Date.today());
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState(DEFAULT_DEPARTMENT);

  const { resources } = useResources(selectedDepartment);

  const pageSize = useResponsiveAgendaPageSize();
  const visibleResources = resources.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const doctorIds = useMemo(() => visibleResources.map(r => Number(r.id)), [visibleResources]);
  const selectedDate = useMemo(() => startDate.toDate(), [startDate]);

  const { appointments } = useAppointmentsData(doctorIds, selectedDate);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', onConfirm: () => {} });
  const navigate = useNavigate();

  function handleEventClick(args: EventClickArgs) {
    const event = args.e.data;

    setModalContent({
      title: 'Modifier le rendez-vous',
      message: `Voulez-vous modifier le rendez-vous de ${event.patient_name} ?`,
      onConfirm: () => navigate('/secretary'), // TODO: navigate to update rdv event.id
    });

    setModalOpen(true);
  }

  function handleTimeRangeSelected(args: {
    start: DayPilot.Date;
    end: DayPilot.Date;
    resource: string | number;
  }) {
    const doctorId = args.resource;
    const date = args.start.toString();

    setModalContent({
      title: 'Créer un rendez-vous',
      message: `Souhaitez-vous créer un rendez-vous le ${date.slice(0, 16).replace('T', ' à ')} ?`,
      onConfirm: () => navigate(`/doctor/appointement/create?doctor=${doctorId}&date=${date}`),
    });

    setModalOpen(true);
  }

  return (
    <div
      className="py-6 px-6 md:px-24"
      role="region"
      aria-label="Agenda de tous les professionnels du service"
    >
      <section className="flex flex-col md:flex-row lg:justify-between md:items-center gap-4 mb-6">
        <div className="flex justify-center lg:justify-start w-full">
          <DepartmentSelect
            value={selectedDepartment}
            onChange={newLabel => {
              setSelectedDepartment(newLabel);
              setCurrentPage(0);
            }}
          />
        </div>
        <div className="flex justify-center md:justify-end w-full">
          <div className="w-full max-w-xs">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Pagination desktop */}
      <section
        className="hidden lg:flex justify-end items-center gap-4 mb-4"
        role="navigation"
        aria-label="Pagination desktop"
      >
        <PaginationControls
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          totalItems={resources.length}
        />
      </section>

      <section className="flex flex-col lg:flex-row gap-10 mt-6">
        {/* Calendar navigator */}
        <aside aria-label="Navigateur de date" className="flex justify-center lg:justify-start">
          <DayPilotNavigator
            selectMode="Day"
            showMonths={1}
            skipMonths={1}
            locale="fr-fr"
            selectionDay={startDate}
            onTimeRangeSelected={args => setStartDate(args.day)}
          />
        </aside>

        {/* Pagination mobile */}
        <section className="lg:hidden" role="navigation" aria-label="Pagination mobile">
          <PaginationControls
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            pageSize={pageSize}
            totalItems={resources.length}
            className="mb-4"
          />
        </section>

        {/* Agenda */}
        <article className="flex-1" aria-label="Agenda de tous les médecins et leurs rendez-vous">
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
                  <img src="${resource.avatar}" alt="${resource.name}" class="w-8 h-8 object-cover" />
                  <div>
                    <div class="text-sm font-semibold text-blue">${resource.name}</div>
                    <div class="text-xs text-gray-400">${resource.speciality}</div>
                  </div>
                </div>
              `,
            }))}
            events={appointments.map((event: Appointment) => {
              const doctorId = event.doctor_id;

              // Start rounded in order to adjust Start to the visible grid
              const snappedStart = roundStartToNextHalfHour(event.start_time);
              const snappedEnd = new Date(snappedStart);
              snappedEnd.setMinutes(snappedStart.getMinutes() + 30); // fixed duration = 30 minutes added

              return {
                id: event.id,
                text: event.patient_name,
                html: `
                <div style="background-color: #e2e8f0; line-height:1.2;">
                  <p style="font-weight: 600; font-size: 11px;">${event.patient_name}</p>
                  <p style="color: #4b5563; font-size: 10px;">${event.appointment_type} <span class="text-xs text-gray-400">Debut: ${event.start_time.slice(11, 16)}</span></p>
                  
                </div>
              `,
                start: new DayPilot.Date(snappedStart.toISOString()),
                end: new DayPilot.Date(snappedEnd.toISOString()),
                resource: doctorId,
              };
            })}
            onEventClick={handleEventClick}
            onTimeRangeSelected={handleTimeRangeSelected}
          />
        </article>
        <ConfirmationModal
          isOpen={modalOpen}
          title={modalContent.title}
          message={modalContent.message}
          onConfirm={() => {
            setModalOpen(false);
            modalContent.onConfirm();
          }}
          onCancel={() => {
            setModalOpen(false);
            navigate('/secretary');
          }}
        />
      </section>
    </div>
  );
}
