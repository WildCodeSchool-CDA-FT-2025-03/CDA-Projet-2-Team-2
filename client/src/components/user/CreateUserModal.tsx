
import { useEffect, useState } from 'react';
import UserForm from './UserForm';

type CreateDepartmentType = {
  label: string;
  building: string;
  wing: string;
  level: string;
};

type CreateUserModalProps = {
  id?: string | null;
  onClose: () => void;
};

export default function CreateUserModal({ id, onClose }: CreateUserModalProps) {
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CreateDepartmentType>({
    label: '',
    building: '',
    wing: '',
    level: ''
  });
  const data = [].

  useEffect(() => {
    if (id) {
      const user = data?.find(user => user.id === id);
      if (user) {
        setFormData({
          label: user.label,
          building: user.building,
          wing: user.wing,
          level: user.level,
        });
      }
    }
  }, [id, data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (Object.values(formData).some(value => value.trim() === '')) {
      setError('Tous les champs doivent être remplis.');
      return;
    }

    try {
      if (id) {
        // updateUser
      } else {
        // createUser
      }
      // await refetch();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Une erreur inattendue s'est produite.`);
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
