import { useParams } from 'react-router-dom';

export default function DoctorAgendaPage() {
  const { doctorId } = useParams();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Planning du médecin</h1>
      <p>ID médecin : {doctorId}</p>
    </div>
  );
}
