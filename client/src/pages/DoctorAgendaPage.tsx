import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { DayPilot } from '@daypilot/daypilot-lite-react';

import { useAuth } from '@/hooks/useAuth';
import useAppointmentsData from '@/hooks/useAppointmentsData';
import useResponsiveAgendaPageSize from '@/hooks/useResponsiveAgendaPageSize';
import useSyncAgendaWithLegalLimit from '@/hooks/useSyncAgendaWithLegalLimit';
import useAgendaEventHandlers from '@/hooks/useAgendaEventHandlers';
import useSearchSources from '@/hooks/useSearchSources';

import AgendaHeader from '@/components/calendar/AgendaHeader';
import AgendaPagination from '@/components/calendar/AgendaPagination';
import DoctorAgendaCalendar from '@/components/calendar/DoctorAgendaCalendar';
import AgendaDateNavigator from '@/components/calendar/AgendaDateNavigator';
import ConfirmationModal from '@/components/modals/ConfirmationModal';

export default function DoctorAgendaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isDoctor = user?.role === 'doctor';
  const doctorId = id ? Number(id) : user?.id;

  // Define the create appointment URL depending on the role
  const appointmentCreateUrl = isDoctor
    ? `/doctor/${doctorId}/appointment/create`
    : `/secretary/doctor/${doctorId}/appointment/create`;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Search bar state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchSources = useSearchSources(searchQuery, 'doctor');

  const {
    selectedAgendaDate: startDate,
    handleDateSelectionWithLimit,
    agendaCalendarRef: calendarRef,
    agendaNavigatorRef: navigatorRef,
  } = useSyncAgendaWithLegalLimit((title, message, onConfirm) => {
    setModalContent({ title, message, onConfirm });
    setModalOpen(true);
  });

  // Compute the selected week Monday
  const selectedDate = useMemo(() => {
    const date = startDate.toDate();
    const day = date.getDay(); // 0 (sunday) → 6 (saturday)
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diff);
    return monday;
  }, [startDate]);

  const { appointments } = useAppointmentsData(
    doctorId !== undefined ? [Number(doctorId)] : [],
    selectedDate,
  );

  const { handleEventClick, handleTimeRangeSelected } = useAgendaEventHandlers({
    onModalOpen: content => {
      setModalContent(content);
      setModalOpen(true);
    },
    navigate,
    limitDate: DayPilot.Date.today().addMonths(3),
  });

  const weekDays = useMemo(() => {
    const monday = new Date(selectedDate);
    monday.setDate(monday.getDate() - monday.getDay() + 1);
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return new DayPilot.Date(date);
    });
  }, [selectedDate]);

  const pageSize = useResponsiveAgendaPageSize();
  const [currentPage, setCurrentPage] = useState(0);
  const visibleDays = weekDays.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  return (
    <div className="py-6 px-6 md:px-24" role="region" aria-label="Agenda hebdomadaire du médecin">
      {/* Header: Button + Title + SearchBar */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-4 lg:items-center">
          {/* Left: Button + Title */}
          <div className="flex items-center gap-4 flex-wrap min-h-[42px]">
            <button
              className="standard-button text-base whitespace-nowrap"
              onClick={() =>
                navigate(appointmentCreateUrl, {
                  state: { from: '/doctor/agenda' },
                })
              }
            >
              Créer un rendez-vous
            </button>

            <h1 className="text-base lg:text-lg font-medium flex items-center gap-2 leading-none">
              {user?.role === 'doctor' ? 'Votre emploi du temps' : 'Emploi du temps de'}
              <span className="text-2xl">👩‍⚕️</span>
              <span className="text-accent font-bold">
                {user?.firstname} {user?.lastname}
              </span>
              {user?.departement?.label && (
                <span className="text-sm text-blue">,{user?.departement.label}</span>
              )}
            </h1>
          </div>

          {/* Right: Search bar */}
          <div className="w-full lg:w-auto">
            <AgendaHeader
              showDepartmentSelector={false}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isOpen={isSearchOpen}
              setIsOpen={setIsSearchOpen}
              searchSources={searchSources}
              placeholder={
                user?.role === 'doctor'
                  ? 'Chercher un patient'
                  : 'Chercher un patient ou un médecin'
              }
            />
          </div>
        </div>
      </div>

      {/* Pagination controls desktop */}
      <section
        className="hidden lg:flex justify-end items-center gap-4 mb-4"
        role="navigation"
        aria-label="Pagination desktop"
      >
        <AgendaPagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          totalItems={7}
          isMobile={true}
        />
      </section>

      <section className="flex flex-col lg:flex-row gap-10 mt-6">
        <AgendaDateNavigator
          navigatorRef={navigatorRef}
          startDate={startDate}
          onDateSelect={handleDateSelectionWithLimit}
        />

        {/* Pagination controls mobile */}
        <section className="lg:hidden mb-4" role="navigation" aria-label="Pagination mobile">
          <AgendaPagination
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            pageSize={pageSize}
            totalItems={7}
            isMobile={false}
          />
        </section>

        <DoctorAgendaCalendar
          calendarRef={calendarRef}
          startDate={startDate}
          visibleDays={visibleDays}
          appointments={appointments}
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
            navigate(user?.role === 'doctor' ? '/doctor' : `/secretary/doctor/${doctorId}/agenda`);
          }}
          onCancel={() => {
            setModalOpen(false);
            navigate(user?.role === 'doctor' ? '/doctor' : `/secretary/doctor/${doctorId}/agenda`);
          }}
        />
      </section>
    </div>
  );
}
