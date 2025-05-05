import { useGetPatientByIdQuery, Patient } from '@/types/graphql-generated';
import InputForm from '@/components/form/InputForm';
import { useState, useEffect } from 'react';

type inputPersonnal = {
  patientNum: number;
};

const initPatient = {
  adress: '',
  birth_city: '',
  birth_date: '',
  city: {
    id: '0',
    city: '',
    postal_code: '',
    patients: [],
  },
  contact_person: '',
  email: '',
  firstname: '',
  gender: '',
  id: '0',
  lastname: '',
  note: '',
  phone_number: '',
  private_assurance: '',
  referring_physician: '',
  social_number: '',
};

export default function PersonnalInformation({ patientNum }: inputPersonnal) {
  const [savePatient, setPersonnalInfo] = useState<Patient>(initPatient);
  const { loading, error, data } = useGetPatientByIdQuery({
    variables: { patientId: patientNum },
  });

  useEffect(() => {
    if (!data?.getPatientByID) return;
    const fetchUser = async () => {
      setPersonnalInfo({
        ...data.getPatientByID,
        city: {
          ...data.getPatientByID.city,
          id: '0',
          patients: [],
        },
      });
    };
    fetchUser();
  }, [data?.getPatientByID]);

  const HandleInfoPersonnel = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPersonnalInfo(() => ({ ...savePatient, [e.target.name]: e.target.value }));
  };

  const handleSubmitInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
      <form onSubmit={handleSubmitInfo}>
        <InputForm
          title="Nom"
          name="lastname"
          placeholder="Nom"
          handle={HandleInfoPersonnel}
          value={savePatient.lastname || ''}
        />
        <InputForm
          title="Prénom"
          name="firstname"
          placeholder="Prénom"
          handle={HandleInfoPersonnel}
          value={savePatient.firstname || ''}
        />
        <InputForm
          title="Téléphone"
          name="phone_number"
          placeholder="Téléphone"
          handle={HandleInfoPersonnel}
          value={savePatient.phone_number || ''}
        />
        <InputForm
          title="Numéro de sécurité sociale"
          name="social_number"
          placeholder="Numéro de sécurité sociale"
          handle={HandleInfoPersonnel}
          value={savePatient.social_number || ''}
        />
        <InputForm
          title="Assurance"
          name="private_assurance"
          placeholder="Assurance"
          handle={HandleInfoPersonnel}
          value={savePatient.private_assurance || ''}
        />
        <InputForm
          title="Genre"
          name="gender"
          placeholder="Genre"
          handle={HandleInfoPersonnel}
          value={savePatient.gender || ''}
        />
        <InputForm
          title="Date de naissance"
          name="birth_date"
          placeholder="Date de naissance"
          handle={HandleInfoPersonnel}
          value={savePatient.birth_date || ''}
        />
        <InputForm
          title="Adresse"
          name="adress"
          placeholder="Adresse"
          handle={HandleInfoPersonnel}
          value={savePatient.adress || ''}
        />
        <InputForm
          title="Code postale"
          name="lastname"
          placeholder="Code postale"
          handle={HandleInfoPersonnel}
          value={savePatient.city.postal_code || ''}
        />
        <InputForm
          title="Ville"
          name="city"
          placeholder="Ville"
          disabled={true}
          handle={HandleInfoPersonnel}
          value={savePatient.city.city || ''}
        />
        <InputForm
          title="Personne à contacter"
          name="contact_person"
          placeholder="Personne à contacter"
          handle={HandleInfoPersonnel}
          value={savePatient.contact_person || ''}
        />
        <InputForm
          title="Médecin traitant"
          name="referring_physician"
          placeholder="Médecin traitant"
          handle={HandleInfoPersonnel}
          value={savePatient.referring_physician || ''}
        />
      </form>
    </>
  );
}
