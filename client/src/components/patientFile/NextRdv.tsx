import ModuleList from '../ModuleList';
import inputPersonnal from '@/types/numPatient.type';
import { useGetNextAppointmentsByPatientQuery } from '@/types/graphql-generated';

type Rdv = {
  id: string;
  doctor: {
    departement: {
      label: string;
    };
    firstname: string;
    lastname: string;
  };
  start_time: string;
};

let dataNextRdv: Rdv[] = [];

export default function NextRdv({ patientNum }: inputPersonnal) {
  const GetNextAppointmentsByPatient = useGetNextAppointmentsByPatientQuery({
    variables: { patientId: patientNum },
  });

  if (GetNextAppointmentsByPatient.loading) return <p>Loading...</p>;
  if (GetNextAppointmentsByPatient.error) return <p>Error</p>;

  if (GetNextAppointmentsByPatient.data)
    dataNextRdv = GetNextAppointmentsByPatient.data.getNextAppointmentsByPatient;

  return (
    <article className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Prochains rendez-vous</h2>
      <ModuleList<Rdv>
        data={dataNextRdv}
        renderItem={item => (
          <>
            <span className="font-bold text-gray-800">
              {item.doctor.firstname} {item.doctor.lastname}
            </span>
            <span className="text-gray-600">
              - {item.doctor.departement.label} -{' '}
              {new Date(item.start_time).toLocaleDateString('fr-FR')} -{' '}
              {new Date(item.start_time).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </>
        )}
      />
    </article>
  );
}
