import AdminDocs from './patientFile/AdminDocs';
import FollowBy from './patientFile/FollowBy';
import LastRdv from './patientFile/LastRdv';
import NextRdv from './patientFile/NextRdv';
import PersonnalInformation from '../components/patientFile/PersonnalInformation';
import { useParams } from 'react-router-dom';

export default function PatientFileSecretary() {
  const { id } = useParams();
  if ((id && isNaN(parseInt(id))) || id === undefined) {
    return <div className="flex items-center justify-center h-screen">Patient not found</div>;
  }
  return (
    <div className="flex flex-wrap gap-10 p-6">
      {/* Colonne 1 */}
      <section className="flex flex-col gap-6 flex-1 min-w-[600px] max-w-[700px]">
        <div className="bg-white rounded-2xl shadow p-4">
          <PersonnalInformation patientNum={parseInt(id)} />
        </div>{' '}
        {/* TODO: make a PatientInformations component instead of this div */}
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
