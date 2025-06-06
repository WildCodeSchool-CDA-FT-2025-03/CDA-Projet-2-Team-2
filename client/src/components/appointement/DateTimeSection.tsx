import DateDisplayInput from '@/components/appointement/DateDisplayInput';
import TimeDisplayInputEnd from '@/components/appointement/TimeDisplayInputEnd';
import TimeSelectStart from '@/components/appointement/TimeSelectStart';

export default function DateTimeSection({ disabledTimes }: { disabledTimes: string[] }) {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 items-start sm:items-end whitespace-nowrap">
        <div>
          <DateDisplayInput />
        </div>
        <div className="flex gap-2">
          <TimeSelectStart disabledOptions={disabledTimes} />
          <TimeDisplayInputEnd />
        </div>
      </div>
    </section>
  );
}
