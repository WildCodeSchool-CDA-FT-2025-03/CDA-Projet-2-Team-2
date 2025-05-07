import {
  useGetPatientByIdQuery,
  Patient,
  useUpdatePatientMutation,
} from '@/types/graphql-generated';
import InputForm from '@/components/form/InputForm';
import InputFormCP from '@/components/form/InputFormCP';
import { useState, useEffect } from 'react';
import SelectForm from '@/components/form/SelectForm';

type inputPersonnal = {
  patientNum: number;
};

export default function PersonnalInformation({ patientNum }: inputPersonnal) {
  const [savePatient, setPersonnalInfo] = useState<Patient | null>(null);
  const [msgUpdate, setMsgUpdate] = useState<string>('');
  const GetPatientByIdQuery = useGetPatientByIdQuery({
    variables: { patientId: patientNum },
  });
  const [UpdatePatientMutation] = useUpdatePatientMutation();

  useEffect(() => {
    const patientByID = GetPatientByIdQuery.data?.getPatientByID;
    if (!patientByID) return;
    const fetchUser = async () => {
      setPersonnalInfo({
        ...patientByID,
        city: {
          ...patientByID.city,
          patients: [],
        },
      });
    };
    fetchUser();
  }, [GetPatientByIdQuery.data?.getPatientByID]);

  const HandleInfoPersonnel = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (savePatient) {
      setPersonnalInfo(() => ({ ...savePatient, [e.target.name]: e.target.value }));
    }
  };

  const HandleCPVille = (cp: string, ville: string) => {
    if (savePatient) {
      setPersonnalInfo(() => ({
        ...savePatient,
        ['city']: {
          ...savePatient.city,
          postal_code: cp,
          city: ville,
        },
      }));
    }
  };

  const handleSubmitInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsgUpdate('');
    if (!savePatient) return;

    await UpdatePatientMutation({
      variables: {
        patientData: {
          id: savePatient.id,
          firstname: savePatient.firstname,
          lastname: savePatient.lastname,
          phone_number: savePatient.phone_number,
          social_number: savePatient.social_number,
          private_assurance: savePatient.private_assurance,
          adress: savePatient.adress,
          referring_physician: savePatient.referring_physician,
          contact_person: savePatient.contact_person,
          birth_date: savePatient.birth_date,
          birth_city: savePatient.birth_city,
          gender: savePatient.gender,
          note: savePatient.note,
          email: savePatient.email || '',
          postal_code: savePatient.city.postal_code,
          city: savePatient.city.city,
        },
      },
    });
    GetPatientByIdQuery.refetch();
    setMsgUpdate('Informations modifiées');
  };

  if (GetPatientByIdQuery.loading) return <p>Loading...</p>;
  if (GetPatientByIdQuery.error) return <p>Error</p>;

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
      <form onSubmit={handleSubmitInfo}>
        <InputForm
          title="Nom"
          name="lastname"
          placeholder="Nom"
          handle={HandleInfoPersonnel}
          value={(savePatient && savePatient.lastname) || ''}
        />
        <InputForm
          title="Prénom"
          name="firstname"
          placeholder="Prénom"
          handle={HandleInfoPersonnel}
          value={(savePatient && savePatient.firstname) || ''}
        />
        <InputForm
          title="Téléphone"
          name="phone_number"
          placeholder="Téléphone"
          handle={HandleInfoPersonnel}
          value={(savePatient && savePatient.phone_number) || ''}
        />
        <InputForm
          title="Email"
          type="email"
          name="email"
          placeholder="Email"
          handle={HandleInfoPersonnel}
          value={(savePatient && savePatient.email) || ''}
        />
        <InputForm
          title="Numéro de sécurité sociale"
          name="social_number"
          placeholder="Numéro de sécurité sociale"
          handle={HandleInfoPersonnel}
          value={(savePatient && savePatient.social_number) || ''}
        />
        <InputForm
          title="Assurance"
          name="private_assurance"
          placeholder="Assurance"
          handle={HandleInfoPersonnel}
          value={(savePatient && savePatient.private_assurance) || ''}
        />
        <SelectForm
          title="Genre"
          name="gender"
          option={[
            { key: 'M', value: 'Homme' },
            { key: 'F', value: 'Femme' },
          ]}
          handle={HandleInfoPersonnel}
          value={(savePatient && savePatient.gender) || ''}
        />
        <InputForm
          title="Date de naissance"
          type="date"
          name="birth_date"
          placeholder="Date de naissance"
          handle={HandleInfoPersonnel}
          value={(savePatient && savePatient.birth_date) || ''}
        />
        <InputForm
          title="Adresse"
          name="adress"
          placeholder="Adresse"
          handle={HandleInfoPersonnel}
          value={(savePatient && savePatient.adress) || ''}
        />
        <InputFormCP
          handle={HandleCPVille}
          value={(savePatient && savePatient.city.postal_code) || ''}
          valuecity={(savePatient && savePatient.city.city) || ''}
        />
        <InputForm
          title="Personne à contacter"
          name="contact_person"
          placeholder="Personne à contacter"
          handle={HandleInfoPersonnel}
          value={(savePatient && savePatient.contact_person) || ''}
        />
        <InputForm
          title="Médecin traitant"
          name="referring_physician"
          placeholder="Médecin traitant"
          handle={HandleInfoPersonnel}
          value={(savePatient && savePatient.referring_physician) || ''}
        />
        <div className="text-accent-500 text-center">{msgUpdate}</div>
        <button type="submit" className="cta block mx-auto">
          Modifier
        </button>
      </form>
    </>
  );
}
