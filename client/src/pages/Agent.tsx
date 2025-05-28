import { useGetUpcomingAppointmentsByPatientAndDepartmentLazyQuery } from '@/types/graphql-generated';
import SearchSection from '@/components/agent/SearchSection';
import AppointmentSection from '@/components/agent/AppointmentSection';

export type Appointment = {
  id: string;
  start_time: string;
  status: string;
  patient: { firstname: string; lastname: string; social_number: string };
  doctor: { firstname: string; lastname: string };
  departement: { id: string; label: string };
  appointmentType: { id: string; reason: string };
};

export default function AgentPage() {
  const [getUpcomingAppointments, { data, loading, error }] =
    useGetUpcomingAppointmentsByPatientAndDepartmentLazyQuery();

  const appointments: Appointment[] = data?.getUpcomingAppointmentsByPatientAndDepartment || [];

  const handleSearch = async (searchQuery: string, searchType: 'social' | 'department') => {
    if (!searchQuery.trim()) return;

    try {
      await getUpcomingAppointments({
        variables: {
          input:
            searchType === 'social'
              ? { socialNumber: searchQuery.trim() }
              : { departmentId: parseInt(searchQuery.trim()) },
        },
      });
    } catch (err) {
      console.error('Erreur lors de la recherche:', err);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <SearchSection handleSearchCallback={handleSearch} error={!!error} loading={loading} />
          <AppointmentSection appointments={appointments} />
        </div>
      </div>
    </div>
  );
}
