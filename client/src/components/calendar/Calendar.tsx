import { DayPilotNavigator } from '@daypilot/daypilot-lite-react';
import { useAppointmentContext } from '@/hooks/useAppointment';

export default function Calendar() {
  const { selectedDay, setSelectedDay } = useAppointmentContext();
  return (
    <>
      <DayPilotNavigator
        selectMode="Day"
        showMonths={1}
        skipMonths={1}
        locale="fr-fr"
        selectionDay={selectedDay} // toujours un DayPilot.Date valide
        onTimeRangeSelected={args => setSelectedDay(args.day)} // gestion des changements
      />
    </>
  );
}
