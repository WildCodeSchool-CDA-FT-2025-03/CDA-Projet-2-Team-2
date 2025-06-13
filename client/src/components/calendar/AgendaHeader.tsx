import { Link } from 'react-router-dom';
import DepartmentSelect from '@/components/form/DepartmentSelect';
import CreatePatient from '@/components/patientFile/CreatePatient';
import SearchBar, { type SearchSource } from '@/components/form/SearchBar';
import type { Doctor } from '@/types/doctor.type';
import type { Patient } from '@/types/patient.type';

type AgendaHeaderProps = {
  selectedDepartment: string;
  setSelectedDepartment: (val: string) => void;
  setCurrentPage: (page: number) => void;
  showAddPatientModal: boolean;
  setShowAddPatientModal: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isOpen: boolean;
  setIsOpen: (boolean: boolean) => void;
  searchSources: SearchSource<Patient | Doctor>[];
};

export default function AgendaHeader({
  selectedDepartment,
  setSelectedDepartment,
  setCurrentPage,
  showAddPatientModal,
  setShowAddPatientModal,
  searchQuery,
  setSearchQuery,
  isOpen,
  setIsOpen,
  searchSources,
}: AgendaHeaderProps) {
  return (
    <section className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
      <div className="flex justify-center lg:justify-start w-full">
        <DepartmentSelect
          value={selectedDepartment}
          onChange={newLabel => {
            setSelectedDepartment(newLabel);
            setCurrentPage(0);
          }}
        />
        <button
          type="button"
          className="px-3 py-1 bg-blue text-white cursor-pointer rounded-md h-10 mt-8 ml-8 text-sm sm:text-base leading-none sm:leading-normal "
          onClick={() => setShowAddPatientModal(true)}
          aria-label="Ajouter un document administratif"
        >
          Créer un patient
        </button>
        {showAddPatientModal && (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-bgModalColor backdrop-blur-xs">
            <CreatePatient onClose={() => setShowAddPatientModal(false)} />
          </div>
        )}
      </div>

      <div className="flex justify-center lg:justify-end w-full">
        <div className="w-full max-w-xs">
          <SearchBar<Patient | Doctor>
            placeholder="Rechercher un patient ou un médecin..."
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            sources={searchSources}
          >
            {(item, source, onSelect) => {
              if (source.name === 'Patients') {
                const patient = item as Patient;
                return (
                  <Link
                    to={`/secretary/patient/${patient.id}`}
                    className="block p-2 border-b last:border-b-0 hover:bg-gray-100"
                    onClick={onSelect}
                  >
                    <p className="font-semibold">
                      🧑 {String(patient.firstname)} {String(patient.lastname)}
                    </p>
                    <p className="text-sm text-gray-500">
                      N° sécu : {String(patient.social_number)}
                    </p>
                  </Link>
                );
              }
              if (source.name === 'Médecins') {
                const doctor = item as Doctor;
                return (
                  <Link
                    to={`/secretary/doctor/${doctor.id}/agenda`}
                    className="block p-2 border-b last:border-b-0 hover:bg-gray-100"
                    onClick={onSelect}
                  >
                    <p className="font-semibold">
                      👨‍⚕️ {String(doctor.firstname)} {String(doctor.lastname)}
                    </p>
                    <p className="text-sm text-gray-500">{String(doctor.departement.label)}</p>
                  </Link>
                );
              }
              return null;
            }}
          </SearchBar>
        </div>
      </div>
    </section>
  );
}
