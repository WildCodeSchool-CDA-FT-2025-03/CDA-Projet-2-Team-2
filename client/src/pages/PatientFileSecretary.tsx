import AdminDocs from '../components/patientFile/AdminDocs';
import FollowBy from '../components/patientFile/FollowBy';
import LastRdv from '../components/patientFile/LastRdv';
import NextRdv from '../components/patientFile/NextRdv';
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
          <PersonnalInformation patientNum={id} />
        </div>{' '}
        {/* TODO: make a PatientInformations component instead of this div */}
      </section>

      {/* Colonne 2 */}
      <section className="flex flex-col gap-6 flex-1 min-w-[500px] max-w-[700px]">
        <NextRdv patientNum={id} />
        <AdminDocs patientNum={id} />
      </section>

      {/* Colonne 3 */}
      <section className="flex flex-col gap-6 flex-1 min-w-[400px] max-w-[700px]">
        <LastRdv patientNum={id} />
        <FollowBy patientNum={id} />
      </section>
    </div>
  );
}
