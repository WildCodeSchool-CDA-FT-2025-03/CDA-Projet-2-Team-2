import { useSearchPatientsQuery, useSearchDoctorsQuery } from '@/types/graphql-generated';
import type { Patient } from '@/types/patient.type';
import type { Doctor } from '@/types/doctor.type';

export default function useSearchSources(searchQuery: string) {
  const {
    data: patientData,
    loading: loadingPatients,
    error: errorPatients,
  } = useSearchPatientsQuery({
    variables: { query: searchQuery },
    skip: searchQuery.length < 2,
  });

  const {
    data: doctorData,
    loading: loadingDoctors,
    error: errorDoctors,
  } = useSearchDoctorsQuery({
    variables: { query: searchQuery },
    skip: searchQuery.length < 2,
  });

  const searchSources = [
    {
      name: 'Patients',
      items: (patientData?.searchPatients ?? []) as Array<Patient | Doctor>,
      loading: loadingPatients,
      error: errorPatients?.message ?? null,
      getKey: (patient: Patient | Doctor) => `patient-${patient.id}`,
    },
    {
      name: 'Médecins',
      items: (doctorData?.searchDoctors ?? []) as Array<Patient | Doctor>,
      loading: loadingDoctors,
      error: errorDoctors?.message ?? null,
      getKey: (doctor: Patient | Doctor) => `doctor-${doctor.id}`,
    },
  ];

  return searchSources;
}
