import ModuleList from './ModuleList';

type Rdv = {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
};

const dataNextRdv: Rdv[] = [
  {
    id: 1,
    doctor: 'Dr Bishop',
    specialty: 'Dermatologie',
    date: '24/04/2025',
    time: '11h05',
  },
  {
    id: 2,
    doctor: 'Dr Maboul',
    specialty: 'Dermatologie',
    date: '24/04/2025',
    time: '11h30',
  },
  {
    id: 3,
    doctor: 'Dr Who',
    specialty: 'Psychiatrie',
    date: '29/04/2025',
    time: '15h50',
  },
  {
    id: 4,
    doctor: 'Dr House',
    specialty: 'Urologie',
    date: '01/07/2025',
    time: '18h30',
  },
];

export default function NextRdv() {
  return (
    <article className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Prochains rendez-vous</h2>
      <ModuleList<Rdv>
        data={dataNextRdv}
        renderItem={item => (
          <>
            <span className="font-bold text-gray-800">{item.doctor}</span>
            <span className="text-gray-600">
              - {item.specialty} - {item.date} - {item.time}
            </span>
          </>
        )}
      />
    </article>
  );
}
