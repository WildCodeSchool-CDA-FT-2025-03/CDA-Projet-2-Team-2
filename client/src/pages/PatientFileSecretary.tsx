import AdminDocs from './patientFile/AdminDocs';
import FollowBy from './patientFile/FollowBy';
import LastRdv from './patientFile/LastRdv';
import NextRdv from './patientFile/NextRdv';

export default function PatientFileSecretary() {
  return (
    <div className="flex flex-wrap gap-10 p-6">
      {/* Colonne 1 */}
      <section className="flex flex-col gap-6 flex-1 min-w-[600px] max-w-[700px]">
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
          <p className="text-gray-600">Bloc à compléter ou personnaliser ultérieurement.</p>
        </div>
      </section>

      {/* Colonne 2 */}
      <section className="flex flex-col gap-6 flex-1 min-w-[500px] max-w-[700px]">
        <NextRdv />
        <AdminDocs />
      </section>

      {/* Colonne 3 */}
      <section className="flex flex-col gap-6 flex-1 min-w-[400px] max-w-[700px]">
        <LastRdv />
        <FollowBy />
      </section>
    </div>
  );
}
