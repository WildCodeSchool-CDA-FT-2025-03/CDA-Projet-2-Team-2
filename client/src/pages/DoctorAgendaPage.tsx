import { useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function DoctorAgendaPage() {
  const { id } = useParams();

  const { user } = useAuth();

  const doctorId = id ? Number(id) : user?.id;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Planning du médecin</h1>
      <p>ID médecin : {doctorId}</p>
    </div>
  );
}
