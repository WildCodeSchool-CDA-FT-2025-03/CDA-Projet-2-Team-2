import { useEffect, useState } from 'react';
import UserForm from './UserForm';
import {
  useGetAllUsersQuery,
  CreateUserInput,
  useCreateUserMutation,
} from '@/types/graphql-generated';
import { ApolloError } from '@apollo/client';

type CreateUserModalProps = {
  id?: string | null;
  onClose: () => void;
};

export default function CreateUserModal({ id, onClose }: CreateUserModalProps) {
  const { data, refetch } = useGetAllUsersQuery();
  const [error, setError] = useState('');
  const [createUser] = useCreateUserMutation();

  const [formData, setFormData] = useState<CreateUserInput>({
    lastname: '',
    firstname: '',
    email: '',
    password: '',
    role: '',
    status: '',
    departementId: 0,
  });

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
        });
      }
    }
  }, [id, data]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
    field: string,
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (Object.values(formData).some(value => typeof value === 'string' && value.trim() === '')) {
      setError('Tous les champs doivent être remplis.');
      return;
    }

    try {
      if (id) {
        // updateUser
      } else {
        formData.departementId = +formData.departementId;
        console.log(formData);
        await createUser({ variables: { input: formData } });
      }
      await refetch();
      onClose();
    } catch (err) {
      setError(
        err instanceof ApolloError
          ? String(err.graphQLErrors[0].extensions?.originalError)
          : `Une erreur inattendue s'est produite.`,
      );
    }
  };
  return (
    <UserForm
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      error={error}
      onClose={onClose}
      id={id ?? null}
      formData={formData}
    />
  );
}
