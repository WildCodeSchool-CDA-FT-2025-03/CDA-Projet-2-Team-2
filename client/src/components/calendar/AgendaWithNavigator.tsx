import { useEffect, useMemo, useState } from 'react';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from '@daypilot/daypilot-lite-react';
import useAppointmentsData from '@/hooks/useAppointmentsData';
import useResponsiveAgendaPageSize from '@/hooks/useResponsiveAgendaPageSize';
import PaginationControls from './PaginationControls';
import useResources from '@/hooks/useResources';
import type { Appointment } from '@/types/CalendarEvent.type';
import { roundStartToNextHalfHour } from '@/utils/roundStartToNextHalfHour';
import { useNavigate } from 'react-router-dom';
import { useSearchPatientsQuery, useSearchDoctorsQuery } from '@/types/graphql-generated';
import { Doctor } from '@/types/doctor.type';
import { Patient } from '@/types/patient.type';
import ConfirmationModal from '../modals/ConfirmationModal';
import { useAppointmentContext } from '@/hooks/useAppointment';
import useSyncAgendaWithLegalLimit from '@/hooks/useSyncAgendaWithLegalLimit';
import AgendaHeader from './AgendaHeader';

export default function AgendaWithNavigator() {
  const DEFAULT_DEPARTMENT = '1';
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState(DEFAULT_DEPARTMENT);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', onConfirm: () => {} });
  const navigate = useNavigate();

  const {
    selectedAgendaDate: startDate, // <- the central state: the selected date
    handleDateSelectionWithLimit, // <- secure date selection function
    agendaCalendarRef: calendarRef, // <- ref to manipulate
    agendaNavigatorRef: navigatorRef, // <- ref to manipulate
  } = useSyncAgendaWithLegalLimit((title, message, onConfirm) => {
    setModalContent({ title, message, onConfirm });
    setModalOpen(true);
  });

  const { resources } = useResources(selectedDepartment);
  const pageSize = useResponsiveAgendaPageSize();
  const visibleResources = resources.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const doctorIds = useMemo(() => visibleResources.map(r => Number(r.id)), [visibleResources]);
  const selectedDate = useMemo(() => startDate.toDate(), [startDate]);

  const { appointments, refetch: refetchAppointments } = useAppointmentsData(
    doctorIds,
    selectedDate,
  );
  const { needToBeRefresh, setNeedToBeRefresh } = useAppointmentContext();

  useEffect(() => {
    if (needToBeRefresh) {
      refetchAppointments();
      setNeedToBeRefresh(false);
    }
  }, [needToBeRefresh, refetchAppointments, setNeedToBeRefresh]);

  const {
    data: patientData,
    loading: loadingPatients,
    error: errorPatients,
  } = useSearchPatientsQuery({
    variables: { query: searchQuery },
    skip: searchQuery.length < 2,
  });

  const {
    data: doctorData,
    loading: loadingDoctors,
    error: errorDoctors,
  } = useSearchDoctorsQuery({
    variables: { query: searchQuery },
    skip: searchQuery.length < 2,
  });

  const searchSources = [
    {
      name: 'Patients',
      items: (patientData?.searchPatients ?? []) as Array<Patient | Doctor>,
      loading: loadingPatients,
      error: errorPatients ? errorPatients.message : null,
      getKey: (patient: Patient | Doctor) => `patient-${patient.id}`,
    },
    {
      name: 'Médecins',
      items: (doctorData?.searchDoctors ?? []) as Array<Patient | Doctor>,
      loading: loadingDoctors,
      error: errorDoctors ? errorDoctors.message : null,
      getKey: (doctor: Patient | Doctor) => `doctor-${doctor.id}`,
    },
  ];

  function handleEventClick(args: { e: { data: Appointment } }) {
    const event = args.e.data;
    setModalContent({
      title: 'Modifier le rendez-vous',
      message: `Voulez-vous modifier le rendez-vous de ${event.patient_name} ?`,
      onConfirm: () => navigate('/secretary'),
    });
    setModalOpen(true);
  }

  function handleTimeRangeSelected(args: {
    start: DayPilot.Date;
    end: DayPilot.Date;
    resource: string | number;
  }) {
    const selectedDate = args.start;
    const today = DayPilot.Date.today();
    const threeMonthsLater = today.addMonths(3);

    if (selectedDate > threeMonthsLater) {
      setModalContent({
        title: 'Date non disponible',
        message: `Les rendez-vous ne peuvent pas être créés après le ${threeMonthsLater.toString('dd/MM/yyyy')}.`,
        onConfirm: () => handleDateSelectionWithLimit(today),
      });
      setModalOpen(true);
      return;
    }

    const doctorId = args.resource;
    const date = selectedDate.toString();

    setModalContent({
      title: 'Créer un rendez-vous',
      message: `Souhaitez-vous créer un rendez-vous le ${date.slice(0, 16).replace('T', ' à ')} ?`,
      onConfirm: () => navigate(`/secretary/doctor/${doctorId}/appointment/create?date=${date}`),
    });
    setModalOpen(true);
  }

  return (
    <div
      className="py-6 px-6 md:px-24"
      role="region"
      aria-label="Agenda de tous les professionnels du service"
    >
      <AgendaHeader
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        setCurrentPage={setCurrentPage}
        showAddPatientModal={showAddPatientModal}
        setShowAddPatientModal={setShowAddPatientModal}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        searchSources={searchSources}
      />

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
        <aside
          aria-label="Navigateur de date"
          className="flex justify-center lg:justify-start bg-white border-1 p-7 rounded-md border-gray-300"
        >
          <DayPilotNavigator
            ref={navigatorRef}
            selectMode="Day"
            showMonths={1}
            skipMonths={1}
            locale="fr-fr"
            selectionDay={startDate}
            onTimeRangeSelected={args => handleDateSelectionWithLimit(args.day)}
          />
        </aside>

        <section className="lg:hidden" role="navigation" aria-label="Pagination mobile">
          <PaginationControls
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            pageSize={pageSize}
            totalItems={resources.length}
            className="mb-4"
          />
        </section>

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
            events={appointments.map((event: Appointment) => {
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
