import { useEffect, useMemo, useState } from 'react';
import { DayPilot } from '@daypilot/daypilot-lite-react';
import useAppointmentsData from '@/hooks/useAppointmentsData';
import useResponsiveAgendaPageSize from '@/hooks/useResponsiveAgendaPageSize';
import useResources from '@/hooks/useResources';
import type { Appointment } from '@/types/CalendarEvent.type';
import { useNavigate } from 'react-router-dom';
import { useSearchPatientsQuery, useSearchDoctorsQuery } from '@/types/graphql-generated';
import { Doctor } from '@/types/doctor.type';
import { Patient } from '@/types/patient.type';
import ConfirmationModal from '../modals/ConfirmationModal';
import { useAppointmentContext } from '@/hooks/useAppointment';
import useSyncAgendaWithLegalLimit from '@/hooks/useSyncAgendaWithLegalLimit';
import AgendaHeader from './AgendaHeader';
import AgendaPagination from './AgendaPagination';
import AgendaCalendar from './AgendaCalendar';
import AgendaDateNavigator from './AgendaDateNavigator';

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

      {/* DESKTOP PAGINATION CONTROLS*/}
      <section
        className="hidden lg:flex justify-end items-center gap-4 mb-4"
        role="navigation"
        aria-label="Pagination desktop"
      >
        <AgendaPagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          totalItems={resources.length}
          isMobile={false}
        />
      </section>

      <section className="flex flex-col lg:flex-row gap-10 mt-6">
        <AgendaDateNavigator
          navigatorRef={navigatorRef}
          startDate={startDate}
          onDateSelect={handleDateSelectionWithLimit}
        />

        {/* MOBILE PAGINATION CONTROLS */}
        <section className="lg:hidden mb-4" role="navigation" aria-label="Pagination mobile">
          <AgendaPagination
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            pageSize={pageSize}
            totalItems={resources.length}
            isMobile={true}
          />
        </section>

        <AgendaCalendar
          calendarRef={calendarRef}
          startDate={startDate}
          appointments={appointments}
          visibleResources={visibleResources}
          onEventClick={handleEventClick}
          onTimeRangeSelected={handleTimeRangeSelected}
        />

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
