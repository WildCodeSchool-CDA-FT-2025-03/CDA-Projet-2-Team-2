import { useEffect, useRef, useState } from 'react';
import { useSearchPatientsQuery, useSearchDoctorsQuery } from '@/types/graphql-generated';
import { Link } from 'react-router-dom';

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false); // searchBar state gestion
  const clickOutsideRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: MouseEvent) => {
    if (clickOutsideRef.current && !clickOutsideRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  const [query, setQuery] = useState('');

  const shouldSearch = query.length >= 2;

  // REQUEST RESULT GESTION AND DECOMPOSITION
  const {
    data: patientData,
    loading: loadingPatients,
    error: errorPatients,
  } = useSearchPatientsQuery({
    variables: { query },
    skip: !shouldSearch, // 🔖 option SKIP passed to an Apollo hook, does not execute the query if !shouldSearch === true, instead of a conditional call with: {data:[]}
  });

  const {
    data: doctorData,
    loading: loadingDoctors,
    error: errorDoctors,
  } = useSearchDoctorsQuery({
    variables: { query },
    skip: !shouldSearch,
  });

  const patients = patientData?.searchPatients ?? [];
  const doctors = doctorData?.searchDoctors ?? [];

  const loading = loadingPatients || loadingDoctors;
  const error = errorPatients || errorDoctors;

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={clickOutsideRef} className="relative w-full max-w-xs ml-auto">
      <input
        type="text"
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        placeholder="Rechercher un patient ou un médecin..."
        className="w-full rounded-full border border-borderColor bg-white pl-4 pr-10 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <img
        src="/search-icon.svg"
        alt="Rechercher"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 pointer-events-none"
      />

      {shouldSearch && isOpen && (
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
                  <p className="font-semibold">
                    🧑 {patient.firstname} {patient.lastname}
                  </p>
                  <p className="text-sm text-gray-500">N° sécu : {patient.social_number}</p>
                </Link>
              </li>
            ))}
            {doctors.map(doctor => (
              <li key={`doctor-${doctor.id}`}>
                <Link
                  to="/secretary-dashboard"
                  className="block p-2 border-b last:border-b-0 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <p className="font-semibold">
                    👨‍⚕️ {doctor.firstname} {doctor.lastname}
                  </p>
                  <p className="text-sm text-gray-500">
                    {doctor.profession} {doctor.departement.label}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
