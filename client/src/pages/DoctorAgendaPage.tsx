import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

import useSyncAgendaWithLegalLimit from '@/hooks/useSyncAgendaWithLegalLimit';
import AgendaDateNavigator from '@/components/calendar/AgendaDateNavigator';
import DoctorAgendaCalendar from '@/components/calendar/DoctorAgendaCalendar';
import AgendaPagination from '@/components/calendar/AgendaPagination';

import ConfirmationModal from '@/components/modals/ConfirmationModal';
import { useMemo, useState } from 'react';
import useAppointmentsData from '@/hooks/useAppointmentsData';
import { DayPilot } from '@daypilot/daypilot-lite-react';
import useAgendaEventHandlers from '@/hooks/useAgendaEventHandlers';
import useResponsiveAgendaPageSize from '@/hooks/useResponsiveAgendaPageSize';

export default function DoctorAgendaPage() {
  const { id } = useParams();

  const { user } = useAuth();

  const doctorId = id ? Number(id) : user?.id;

  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const {
    selectedAgendaDate: startDate,
    handleDateSelectionWithLimit,
    agendaCalendarRef: calendarRef,
    agendaNavigatorRef: navigatorRef,
  } = useSyncAgendaWithLegalLimit((title, message, onConfirm) => {
    setModalContent({ title, message, onConfirm });
    setModalOpen(true);
  });

  const selectedDate = useMemo(() => {
    const date = startDate.toDate();
    const day = date.getDay(); // 0 (sunday) → 6 (saturday)
    const diff = day === 0 ? -6 : 1 - day; // calculate the shift to return to Monday
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
    const monday = new Date(selectedDate); // the current monday
    monday.setDate(monday.getDate() - monday.getDay() + 1); // make sure we start Monday well
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return new DayPilot.Date(date);
    });
  }, [selectedDate]);

  const pageSize = useResponsiveAgendaPageSize(); // ex: 3 in mobile
  const [currentPage, setCurrentPage] = useState(0);

  const visibleDays = weekDays.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  return (
    <div className="py-6 px-6 md:px-24" role="region" aria-label="Agenda hebdomadaire du médecin">
      <h1 className="text-2xl font-bold mb-4">Planning du médecin</h1>

      {/* PAGINATION CONTROLS DESKTOP */}
      <section
        className="hidden lg:flex justify-end items-center gap-4 mb-4"
        role="navigation"
        aria-label="Pagination desktop"
      >
        <AgendaPagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          totalItems={7} // week days
          isMobile={true}
        />
      </section>

      <section className="flex flex-col lg:flex-row gap-10 mt-6">
        <AgendaDateNavigator
          navigatorRef={navigatorRef}
          startDate={startDate}
          onDateSelect={handleDateSelectionWithLimit}
        />

        {/* PAGINATION CONTROLS MOBILE */}
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
