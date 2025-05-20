import { Planning } from '@/pages/CreateUser';
import UserButtons from './UserButtons';
import { useState } from 'react';

const days = [
  { fr: 'Lundi', en: 'Monday' },
  { fr: 'Mardi', en: 'Tuesday' },
  { fr: 'Mercredi', en: 'Wednesday' },
  { fr: 'Jeudi', en: 'Thursday' },
  { fr: 'Vendredi', en: 'Friday' },
  { fr: 'Samedi', en: 'Saturday' },
  { fr: 'Dimanche', en: 'Sunday' },
];
type UserPlanningProps = {
  userPlanning: Planning;
  setUserPlanning: (planning: Planning | ((prev: Planning) => Planning)) => void;
  error: string;
  setError: (error: string) => void;
};

export default function UserPlanning({
  userPlanning,
  setUserPlanning,
  error,
  setError,
}: UserPlanningProps) {
  const [isDisable, setIsDisable] = useState(false);

  const handleChange = (day: string, field: 'start' | 'end', value: string) => {
    setIsDisable(false);
    setError('');
    setUserPlanning((prev: Planning) => {
      const [startTime, endTime] = [
        field === 'start' ? value : prev[day].start,
        field === 'end' ? value : prev[day].end,
      ];
      const [startMinutes, endMinutes] = [startTime, endTime].map(time =>
        time ? parseInt(time.split('h')[0]) * 60 + parseInt(time.split('h')[1]) : null,
      );

      if (
        startMinutes !== null &&
        endMinutes !== null &&
        startMinutes >= endMinutes &&
        value !== ''
      ) {
        setError("L'heure de fin doit être supérieure à l'heure de début.");
        return prev;
      }

      return {
        ...prev,
        [day]: { ...prev[day], [field]: value },
      };
    });
  };
  return (
    <section className="bg-white items-center p-12 mb-4">
      <h3 className="text-blue font-semibold mb-6">Planning du nouvel utilisateur</h3>
      {error && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          {error}
        </div>
      )}
      <article className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {days.map(day => (
          <div
            key={day.en}
            className="flex items-center justify-between  bg-blue-50 p-4 rounded-lg"
          >
            <p className="font-semibold mb-2">{day.fr}</p>
            <div className="flex flex-col items-start gap-2">
              <span>Début</span>
              <select
                value={userPlanning[day.en].start}
                onChange={e => handleChange(day.en, 'start', e.target.value)}
                className="border border-gray-300 rounded p-1"
              >
                <option value="">-</option>
                {Array.from({ length: 48 }, (_, i) => {
                  const hours = Math.floor(i / 2);
                  const minutes = i % 2 === 0 ? '00' : '30';
                  return `${hours}h${minutes}`;
                }).map(time => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col items-start gap-2">
              <span>Fin</span>
              <select
                value={userPlanning[day.en].end}
                onChange={e => handleChange(day.en, 'end', e.target.value)}
                className="border border-gray-300 rounded p-1"
              >
                <option value="">-</option>
                {Array.from({ length: 48 }, (_, i) => {
                  const hours = Math.floor(i / 2);
                  const minutes = i % 2 === 0 ? '00' : '30';
                  return `${hours}h${minutes}`;
                }).map(time => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </article>
      <UserButtons id={null} isDisable={isDisable} />
    </section>
  );
}
