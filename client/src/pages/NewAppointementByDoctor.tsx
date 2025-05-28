import SearchBar from '@/components/form/SearchBar';
import SelectForm from '@/components/form/SelectForm';
import UserItem from '@/components/user/UserItem';
import { DayPilot, DayPilotNavigator } from '@daypilot/daypilot-lite-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function NewAppointementByDoctor() {
  const [params] = useSearchParams();

  const [selectedDay, setSelectedDay] = useState<DayPilot.Date>(
    new DayPilot.Date(DayPilot.Date.today()), // valeur par défaut = aujourd'hui
  );

  useEffect(() => {
    const dateParam = params.get('date');
    if (dateParam) {
      setSelectedDay(new DayPilot.Date(dateParam));
    }
  }, [params]);

  const generateTimeOptions = () => {
    const times = [];
    for (let h = 8; h < 24; h++) {
      times.push(`${h.toString().padStart(2, '0')}:00`);
      times.push(`${h.toString().padStart(2, '0')}:30`);
    }
    return times;
  };

  const formatDate = (dpDate: DayPilot.Date) => {
    const date = new Date(dpDate.toString()); // Convertir DayPilot.Date en Date JS
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const timeOptions = generateTimeOptions();

  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

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
                {/* Jour */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="day-selected" className="text-sm text-blue-900 font-semibold">
                    Jour
                  </label>
                  <div className="w-[120px] h-[60px]">
                    <input
                      id="day-selected"
                      type="text"
                      value={formatDate(selectedDay)}
                      disabled
                      className="w-full h-full pl-3 pr-4 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Début */}
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
                      value={startTime}
                      onChange={e => handleStartChange(e.target.value)}
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

                {/* Fin */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="end-time" className="text-sm text-blue-900 font-semibold">
                    Fin
                  </label>
                  <div className="relative w-[120px] h-[60px]">
                    <img
                      src="/alarm-clock-off.svg"
                      alt="Icône fin"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5"
                    />
                    <input
                      id="end-time"
                      type="text"
                      value={endTime}
                      disabled
                      className="w-full h-full pl-10 pr-4 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
