import { useEffect, useState } from 'react';
import {
  useGetAllUsersQuery,
  useCreateUserMutation,
  useCreateDoctorPlanningMutation,
} from '@/types/graphql-generated';
import { ApolloError } from '@apollo/client';
import UserPersonalForm from '@/components/user/UserPersonalForm';
import UserProfessionalForm from '@/components/user/UserProfessionalForm';
import UserPlanning from '@/components/user/UserPlanning';
import { useNavigate } from 'react-router-dom';
import UserButtons from '@/components/user/UserButtons';

type CreateUserModalProps = {
  id?: string | null;
};

type FormDataType = {
  lastname: string;
  firstname: string;
  email: string;
  password: string;
  role: string;
  status: string;
  activationDate: string | null;
  departementId: number;
  gender: string;
  tel: string;
  profession: string;
};

export type Planning = {
  [day: string]: {
    start: string;
    end: string;
    off: boolean;
  };
};

const initialFormData: FormDataType = {
  lastname: '',
  firstname: '',
  email: '',
  password: '',
  role: '',
  status: '',
  activationDate: null,
  departementId: 0,
  gender: '',
  tel: '',
  profession: '',
};

const days = [
  { fr: 'Lundi', en: 'Monday' },
  { fr: 'Mardi', en: 'Tuesday' },
  { fr: 'Mercredi', en: 'Wednesday' },
  { fr: 'Jeudi', en: 'Thursday' },
  { fr: 'Vendredi', en: 'Friday' },
  { fr: 'Samedi', en: 'Saturday' },
  { fr: 'Dimanche', en: 'Sunday' },
];

const initialPlanning: Planning = days.reduce((acc, day) => {
  acc[day.en] = { start: '', end: '', off: false };
  return acc;
}, {} as Planning);

export default function CreateUser({ id }: CreateUserModalProps) {
  const { data, refetch } = useGetAllUsersQuery();
  const [createUser] = useCreateUserMutation();
  const [createPlanning] = useCreateDoctorPlanningMutation();
  const [error, setError] = useState('');
  const [isDoctor, setIsDoctor] = useState(false);
  const [isDisable] = useState(false);
  const [formData, setFormData] = useState<FormDataType>(initialFormData);
  const [userPlanning, setUserPlanning] = useState<Planning>(initialPlanning);
  const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      const user = data?.getAllUsers?.find(user => user.id === id);
      if (user) {
        setFormData({
          lastname: user.lastname,
          firstname: user.firstname,
          email: user.email,
          password: '',
          role: user.role,
          status: user.status,
          departementId: Number(user.departement?.id),
          activationDate: user.activationDate || null,
          gender: user.gender || '',
          tel: user.tel || '',
          profession: user.profession || '',
        });
      }
    }
  }, [id, data, formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'role') {
      setIsDoctor(value === 'doctor');
    }
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (Object.values(formData).some(value => typeof value === 'string' && value.trim() === '')) {
      setError('Tous les champs doivent être remplis.');
      return;
    }
    if (
      isDoctor &&
      !Object.values(userPlanning).some(day => (day.start !== '' && day.end !== '') || day.off)
    ) {
      setError('Au moins un jour doit être rempli.');
      return;
    }

    try {
      if (!id) {
        const createdUser = await createUser({
          variables: { input: { ...formData, departementId: +formData.departementId } },
        });

        if (isDoctor && createdUser.data) {
          // createPlanning
          const planningInput = Object.keys(userPlanning).reduce(
            (acc, day) => {
              const dayLower = day.toLowerCase();
              acc[`${dayLower}_start`] =
                (userPlanning[day].off || userPlanning[day].start) === ''
                  ? null
                  : userPlanning[day].start;
              acc[`${dayLower}_end`] =
                userPlanning[day].off || userPlanning[day].end === ''
                  ? null
                  : userPlanning[day].end;
              return acc;
            },
            {} as Record<string, string | null>,
          );
          await createPlanning({
            variables: {
              createDoctorPlanningId: createdUser.data?.createUser.id,
              input: {
                start: new Date().toISOString(),
                end: null,
                ...planningInput,
              },
            },
          });
        }
      } else {
        // updateUser
      }
      await refetch();
      navigate('/users');
    } catch (err) {
      setError(
        err instanceof ApolloError
          ? String(err.graphQLErrors[0].extensions?.originalError)
          : `Une erreur inattendue s'est produite.`,
      );
    }
  };
  return (
    <main className="container mx-auto pt-4 pr-12 pl-12 pb-12 flex flex-col gap-4">
      <header className="flex items-center mb-4">
        <h2 className="text-xl mr-5 font-semibold text-gray-700">Créer un nouvel utilisateur</h2>
      </header>
      <form onSubmit={handleSubmit}>
        <section className="bg-white items-center p-12 mb-4">
          {error && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
              {error}
            </div>
          )}
          <article className="flex flex-col md:flex-row justify-around p-2 gap-4">
            <UserPersonalForm
              handleInputChange={handleInputChange}
              id={id ?? null}
              formData={{
                ...formData,
                activationDate: formData.activationDate ? formData.activationDate.toString() : null,
              }}
            />
            <UserProfessionalForm
              handleInputChange={handleInputChange}
              id={id ?? null}
              formData={{
                ...formData,
                activationDate: formData.activationDate ? formData.activationDate.toString() : null,
              }}
            />
          </article>
          {!isDoctor && <UserButtons id={id ?? null} isDisable={isDisable} />}
        </section>
        {isDoctor && (
          <UserPlanning
            userPlanning={userPlanning}
            setUserPlanning={setUserPlanning}
            error={error}
            setError={setError}
          />
        )}
      </form>
    </main>
  );
}
