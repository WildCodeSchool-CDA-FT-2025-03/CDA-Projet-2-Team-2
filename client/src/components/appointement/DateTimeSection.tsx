import DateDisplayInput from '@/components/appointement/DateDisplayInput';
import TimeDisplayInputEnd from '@/components/appointement/TimeDisplayInputEnd';
import TimeSelectStart from '@/components/appointement/TimeSelectStart';
import { formatDate } from '@/utils/formatDateFr';
import { DayPilot } from '@daypilot/daypilot-lite-react';

type DateTimeSectionProps = {
  selectedDay: DayPilot.Date;
  startTime: string;
  handleStartChange: (value: string) => void;
  endTime: string;
  disabledTimes: string[];
};

export default function DateTimeSection({
  selectedDay,
  startTime,
  handleStartChange,
  endTime,
  disabledTimes,
}: DateTimeSectionProps) {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 items-start sm:items-end whitespace-nowrap">
        <div>
          <DateDisplayInput value={formatDate(selectedDay.toDate())} />
        </div>
        <div className="flex gap-2">
          <TimeSelectStart
            value={startTime}
            onChange={handleStartChange}
            disabledOptions={disabledTimes}
          />
          <TimeDisplayInputEnd value={endTime} />
        </div>
      </div>
    </section>
  );
}
