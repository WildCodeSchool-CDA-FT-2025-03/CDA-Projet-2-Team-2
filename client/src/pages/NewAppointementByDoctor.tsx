import SearchBar from '@/components/form/SearchBar';
import { DayPilotNavigator } from '@daypilot/daypilot-lite-react';
import { useSearchParams } from 'react-router-dom';

export default function NewAppointementByDoctor() {
  const [params] = useSearchParams();
  return (
    <>
      <div>{`NewAppointementByDoctor ${params.get('doctor')}`}</div>
      <h2>
        Creer un rendez-vous avec Nom du doctor, <span>profession, service</span>
      </h2>
      <section>
        <SearchBar />
      </section>
      <section>
        <aside>
          <DayPilotNavigator />
        </aside>
        <div>
          <h3>Patient info</h3>
          <h3>Select motif de consultation</h3>
          <div>
            Debut - Fin
            <button className="cta-red">Annuler</button>
            <button className="cta">Enregistrer</button>
          </div>
        </div>
      </section>
    </>
  );
}
