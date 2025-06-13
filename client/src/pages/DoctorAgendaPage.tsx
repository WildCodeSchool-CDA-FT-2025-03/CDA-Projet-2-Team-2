import { useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function DoctorAgendaPage() {
  const { id } = useParams();

  const { user } = useAuth();

  const doctorId = id ? Number(id) : user?.id;

  return (
    <div className="py-6 px-6 md:px-24" role="region" aria-label="Agenda hebdomadaire du médecin">
      <h1 className="text-2xl font-bold mb-4">Planning du médecin</h1>

      <section className="flex flex-col lg:flex-row gap-10 mt-6">
        {/* On ajoutera le navigator et le calendrier ici dans les étapes suivantes */}
        <p>ID du médecin : {doctorId}</p>
      </section>
    </div>
  );
}
