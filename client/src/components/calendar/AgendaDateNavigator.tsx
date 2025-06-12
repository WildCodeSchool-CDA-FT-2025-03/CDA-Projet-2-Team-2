import { DayPilotNavigator, DayPilot } from '@daypilot/daypilot-lite-react';
import type { RefObject } from 'react';

type AgendaDateNavigatorProps = {
  navigatorRef: RefObject<DayPilotNavigator | null>;
  startDate: DayPilot.Date;
  onDateSelect: (day: DayPilot.Date) => void;
};

export default function AgendaDateNavigator({
  navigatorRef,
  startDate,
  onDateSelect,
}: AgendaDateNavigatorProps) {
  return (
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
        onTimeRangeSelected={args => onDateSelect(args.day)}
      />
    </aside>
  );
}
