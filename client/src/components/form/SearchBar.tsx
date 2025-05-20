import { useState } from 'react';
import { useSearchPatientsQuery } from '@/types/graphql-generated';
import { Link } from 'react-router-dom';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  const shouldSearch = query.length >= 2;

  const {
    data: patientData,
    loading: loadingPatients,
    error: errorPatients,
  } = useSearchPatientsQuery({
    variables: { query },
    skip: !shouldSearch,
  });

  const patients = patientData?.searchPatients ?? [];

  const loading = loadingPatients;
  const error = errorPatients;

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Rechercher un patient ou un médecin..."
        className="w-full border border-gray-300 p-2 rounded"
      />

      {shouldSearch && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-80 overflow-y-auto">
          {loading && <p className="p-2 text-sm text-gray-500">Chargement...</p>}
          {error && <p className="p-2 text-sm text-red-500">Erreur lors de la recherche.</p>}

          {!loading && patients.length === 0 && (
            <p className="p-2 text-sm text-gray-500">Aucun résultat trouvé.</p>
          )}

          <ul>
            {patients.map(patient => (
              <li key={`patient-${patient.id}`}>
                <Link
                  to={`/patient-secretary/${patient.id}`}
                  className="block p-2 border-b last:border-b-0 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div className="font-semibold">
                    🧑 {patient.firstname} {patient.lastname}
                  </div>
                  <div className="text-sm text-gray-500">N° sécu : {patient.social_number}</div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
