import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import useSyncAgendaWithLegalLimit from '@/hooks/useSyncAgendaWithLegalLimit';
import AgendaDateNavigator from '@/components/calendar/AgendaDateNavigator';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import { useState } from 'react';

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    agendaCalendarRef: _calendarRef,
    agendaNavigatorRef: navigatorRef,
  } = useSyncAgendaWithLegalLimit((title, message, onConfirm) => {
    setModalContent({ title, message, onConfirm });
    setModalOpen(true);
  });

  return (
    <div className="py-6 px-6 md:px-24" role="region" aria-label="Agenda hebdomadaire du médecin">
      <h1 className="text-2xl font-bold mb-4">Planning du médecin</h1>

      <section className="flex flex-col lg:flex-row gap-10 mt-6">
        {/* On ajoutera le navigator et le calendrier ici dans les étapes suivantes */}
        <AgendaDateNavigator
          navigatorRef={navigatorRef}
          startDate={startDate}
          onDateSelect={handleDateSelectionWithLimit}
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
        <p>ID du médecin : {doctorId}</p>
      </section>
    </div>
  );
}
