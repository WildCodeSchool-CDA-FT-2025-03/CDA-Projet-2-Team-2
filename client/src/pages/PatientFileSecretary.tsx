import AdminDocs from './patientFile/AdminDocs';
import LastRdv from './patientFile/LastRdv';
import NextRdv from './patientFile/NextRdv';

export default function PatientFileSecretary() {
  return (
    <div className="flex flex-wrap gap-6 p-6">
      {/* Colonne 1 */}
      <section className="flex flex-col gap-6 flex-1 min-w-[300px] max-w-[400px]">
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
          <p className="text-gray-600">Bloc à compléter ou personnaliser ultérieurement.</p>
        </div>
      </section>

      {/* Colonne 2 */}
      <section className="flex flex-col gap-6 flex-1 min-w-[300px] max-w-[600px]">
        <NextRdv />
        <AdminDocs />
      </section>

      {/* Colonne 3 */}
      <section className="flex flex-col gap-6 flex-1 min-w-[300px] max-w-[400px]">
        <LastRdv />
        <article className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Suivi par :</h2>
          <ul className="space-y-2">
            <li>Dr Bishop - Dermatological service</li>
            <li>Dr Maboul - Dermatological service</li>
            <li>Dr Who - Psychiatric service</li>
            <li>Dr House - Urology service</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
