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
      <div className="flex gap-4 items-end whitespace-nowrap">
        <DateDisplayInput value={formatDate(selectedDay.toDate())} />
        <TimeSelectStart
          value={startTime}
          onChange={handleStartChange}
          disabledOptions={disabledTimes}
        />
        <TimeDisplayInputEnd value={endTime} />
      </div>
    </section>
  );
}
