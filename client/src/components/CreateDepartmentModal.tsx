import {
  useCreateDepartementMutation,
  useGetDepartementsQuery,
  useUpdateDepartmentMutation,
} from '@/types/graphql-generated';
import { useEffect, useState } from 'react';
import DepartmentForm from './form/DepartmentForm';

type CreateDepartmentType = {
  label: string;
  building: string;
  wing: string;
  level: string;
};

type CreateDepartmentModalProps = {
  id?: string | null;
  onClose: () => void;
};

export default function CreateDepartmentModal({ id, onClose }: CreateDepartmentModalProps) {
  const [error, setError] = useState('');
  const { refetch, data } = useGetDepartementsQuery();
  const [formData, setFormData] = useState<CreateDepartmentType>({
    label: '',
    building: '',
    wing: '',
    level: '',
  });

  const [createDepartement] = useCreateDepartementMutation();
  const [updateDepartement] = useUpdateDepartmentMutation();

  useEffect(() => {
    if (id) {
      const department = data?.getDepartements.find(department => department.id === id);
      if (department) {
        setFormData({
          label: department.label,
          building: department.building,
          wing: department.wing,
          level: department.level,
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
        await updateDepartement({ variables: { updateDepartmentId: id, data: formData } });
      } else {
        await createDepartement({ variables: { data: formData } });
      }
      await refetch();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Une erreur inattendue s'est produite.`);
    }
  };

  return (
    <DepartmentForm
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      error={error}
      onClose={onClose}
      id={id ?? null}
      formData={formData}
    />
  );
}
