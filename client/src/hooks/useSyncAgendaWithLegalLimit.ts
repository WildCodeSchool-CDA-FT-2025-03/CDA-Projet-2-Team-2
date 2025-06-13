import { useState, useRef } from 'react';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from '@daypilot/daypilot-lite-react';
import { useNavigate } from 'react-router-dom';

type UseSyncAgendaWithLegalLimit = {
  selectedAgendaDate: DayPilot.Date; // <- the central state: the selected date
  updateAgendaDate: (newDate: DayPilot.Date) => void; // <- to manually update the date
  agendaCalendarRef: React.RefObject<DayPilotCalendar | null>; // <- ref to manipulate
  agendaNavigatorRef: React.RefObject<DayPilotNavigator | null>; // <- ref to manipulate
  handleDateSelectionWithLimit: (selectedDate: DayPilot.Date) => void; // <- secure date selection function
};

//Added: props to allow opening an external modal
export default function useSyncAgendaWithLegalLimit(
  openModal?: (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
  ) => void,
): UseSyncAgendaWithLegalLimit {
  const [selectedAgendaDate, setSelectedAgendaDate] = useState(DayPilot.Date.today());

  const agendaCalendarRef = useRef<DayPilotCalendar>(null);
  const agendaNavigatorRef = useRef<DayPilotNavigator>(null);

  const navigate = useNavigate();

  const handleDateSelectionWithLimit = (selectedDate: DayPilot.Date) => {
    const today = DayPilot.Date.today();
    const maxAllowedDate = today.addMonths(3);

    const calendar = agendaCalendarRef.current?.control;
    const navigator = agendaNavigatorRef.current?.control;

    if (selectedDate > maxAllowedDate) {
      // If a modal function is provided, it is called
      if (openModal) {
        openModal(
          'Date non autorisée',
          `Les rendez-vous ne peuvent pas dépasser le ${maxAllowedDate.toString('dd/MM/yyyy')}.`,
          () => {
            setSelectedAgendaDate(today);
            calendar?.update({ startDate: today });
            navigator?.select(today);
            navigate('/secretary');
          },
        );
      } else {
        // if no modal connected
        setSelectedAgendaDate(today);
        calendar?.update({ startDate: today });
        navigator?.select(today);
        navigate('/secretary');
      }

      return;
    }

    // Else, everything is fine.
    setSelectedAgendaDate(selectedDate);
    calendar?.update({ startDate: selectedDate });
    navigator?.select(selectedDate);
  };

  const updateAgendaDate = (newDate: DayPilot.Date) => {
    setSelectedAgendaDate(newDate);
    agendaCalendarRef.current?.control?.update({ startDate: newDate });
    agendaNavigatorRef.current?.control?.select(newDate);
  };

  return {
    selectedAgendaDate,
    updateAgendaDate,
    agendaCalendarRef,
    agendaNavigatorRef,
    handleDateSelectionWithLimit,
  };
}
