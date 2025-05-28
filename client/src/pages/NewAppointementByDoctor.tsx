import SearchBar from '@/components/form/SearchBar';
import UserItem from '@/components/UserItem';
import { DayPilotNavigator } from '@daypilot/daypilot-lite-react';
import { useSearchParams } from 'react-router-dom';

export default function NewAppointementByDoctor() {
  const [params] = useSearchParams();
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
          <DayPilotNavigator />
        </aside>
        <div>
          <UserItem />
          <h3>Select motif de consultation</h3>
          <div>
            Debut - Fin
            <button className="standard-button-red">Annuler</button>
            <button className="standard-button">Enregistrer</button>
          </div>
        </div>
      </section>
    </>
  );
}
