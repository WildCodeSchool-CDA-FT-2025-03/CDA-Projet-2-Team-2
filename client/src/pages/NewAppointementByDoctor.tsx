import DateDisplayInput from '@/components/appointement/DateDisplayInput';
import TimeDisplayInputEnd from '@/components/appointement/TimeDisplayInputEnd';
import TimeSelectStart from '@/components/appointement/TimeSelectStart';
import SearchBar from '@/components/form/SearchBar';
import SelectForm from '@/components/form/SelectForm';
import UserItem from '@/components/user/UserItem';
import { formatDate } from '@/utils/formatDateFr';
import { DayPilot, DayPilotNavigator } from '@daypilot/daypilot-lite-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function NewAppointementByDoctor() {
  const [params] = useSearchParams();

  const [selectedDay, setSelectedDay] = useState<DayPilot.Date>(
    new DayPilot.Date(DayPilot.Date.today()), // valeur par défaut = aujourd'hui
  );
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    const dateParam = params.get('date');
    if (dateParam) {
      const [fullDate, timePart] = dateParam.split('T');

      // ✅ Mettre la date (YYYY-MM-DD) dans DayPilot.Date
      setSelectedDay(new DayPilot.Date(fullDate));

      // ✅ Si l'heure est présente, on la traite
      if (timePart) {
        const hourMinute = timePart.slice(0, 5); // "14:00"
        setStartTime(hourMinute);

        // Calcul automatique de fin (+30 min)
        const [hour, minute] = hourMinute.split(':').map(Number);
        const end = new Date();
        end.setHours(hour, minute + 30);
        const endHour = end.getHours().toString().padStart(2, '0');
        const endMinute = end.getMinutes().toString().padStart(2, '0');
        setEndTime(`${endHour}:${endMinute}`);
      }
    }
  }, [params]);

  const handleStartChange = (value: string) => {
    setStartTime(value);
    const [hour, minute] = value.split(':').map(Number);
    const newDate = new Date();
    newDate.setHours(hour, minute + 30);
    const endHour = newDate.getHours().toString().padStart(2, '0');
    const endMinute = newDate.getMinutes().toString().padStart(2, '0');
    setEndTime(`${endHour}:${endMinute}`);
  };
  return (
    <>
      <div>{`NewAppointementByDoctor ${params.get('doctor')}`}</div>
      <div className="flex flex-col w-3/4">
        <section className="flex flex-col gap-4 self-start">
          <div className="flex gap-4">
            <img src="/calendar-clock.svg" alt="icone de creation de rendez-vous" />
            <h2>
              Creer un rendez-vous avec Nom du doctor, <span>profession, service</span>
            </h2>
          </div>
          <div className="self-start">
            <SearchBar />
          </div>
        </section>
      </div>
      <section className="bg-bgBodyColor sm:w-full md:w-3/4 p-4 sm:p-6 md:p-12 lg:p-24 rounded-sm shadow-md border-borderColor flex flex-col md:flex-row justify-center gap-10 md:gap-45">
        <aside>
          <DayPilotNavigator
            selectMode="Day"
            showMonths={1}
            skipMonths={1}
            locale="fr-fr"
            selectionDay={selectedDay} // toujours un DayPilot.Date valide
            onTimeRangeSelected={args => setSelectedDay(args.day)} // gestion des changements
          />
        </aside>
        <div className="flex flex-col gap-4">
          <UserItem />
          <SelectForm
            name="motifs"
            value="pupu"
            title="Motif de consultation"
            option={[]}
            handle={() => console.warn('truc')}
          />
          <div>
            <div className="flex flex-col gap-2">
              {/* Ligne des champs : Jour, Début, Fin */}
              <div className="flex gap-4 items-end whitespace-nowrap">
                <DateDisplayInput value={formatDate(selectedDay.toDate())} />
                <TimeSelectStart value={startTime} onChange={handleStartChange} />
                <TimeDisplayInputEnd value={endTime} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
