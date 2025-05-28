import { generateTimeOptions } from '@/utils/generatedTimeOptions';

type TimeSelectStartProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function TimeSelectStart({ value, onChange }: TimeSelectStartProps) {
  const timeOptions = generateTimeOptions();

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="start-time" className="text-sm text-blue-900 font-semibold">
        Début
      </label>
      <div className="relative w-[120px] h-[60px]">
        <img
          src="/alarm-clock-on.svg"
          alt="Icône début"
          className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5"
        />
        <select
          id="start-time"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full h-full pl-10 pr-4 border border-gray-300 rounded-lg bg-white text-blue-900 cursor-pointer"
        >
          <option value="">-</option>
          {timeOptions.map(time => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
