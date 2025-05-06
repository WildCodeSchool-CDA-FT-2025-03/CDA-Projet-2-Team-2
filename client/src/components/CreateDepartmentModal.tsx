import InputForm from '@/components/form/InputForm';
import { useCreateDepartementMutation, useGetDepartementsQuery } from '@/types/graphql-generated';
import { useState } from 'react';

type CreateDepartmentType = {
  label: string;
  building: string;
  wing: string;
  level: string;
};

type CreateDepartmentModalProps = {
  onClose: () => void;
};

export default function CreateDepartmentModal({ onClose }: CreateDepartmentModalProps) {
  const [error, setError] = useState('');
  const { refetch } = useGetDepartementsQuery();
  const [formData, setFormData] = useState<CreateDepartmentType>({
    label: '',
    building: '',
    wing: '',
    level: '',
  });
  const [createDepartement] = useCreateDepartementMutation();

  const handleInputChange =
    (field: keyof CreateDepartmentType) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
      await createDepartement({ variables: { data: formData } });
      await refetch();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Une erreur inattendue s'est produite.`);
    }
  };

  return (
    <div className="container mx-auto p-4 gap-4 h-screen w-2/5">
      <h2 className="p-3 flex items-center">Créer un nouveau service</h2>
      <div className="bg-white mx-auto p-4">
        <h3>Information du service</h3>
        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            {error}
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="w-4/5 mt-2">
            <InputForm
              title="Denomination"
              name="label"
              type="text"
              value={formData.label}
              placeholder="Denomination"
              handle={handleInputChange('label')}
            />
            <InputForm
              title="Batiment"
              name="building"
              type="text"
              value={formData.building}
              placeholder="Batiment"
              handle={handleInputChange('building')}
            />
            <InputForm
              title="Aile"
              name="wing"
              type="text"
              value={formData.wing}
              placeholder="Aile"
              handle={handleInputChange('wing')}
            />
            <InputForm
              title="Niveau"
              name="level"
              type="text"
              value={formData.level}
              placeholder="Niveau"
              handle={handleInputChange('level')}
            />
            <div className="flex justify-end p-2 mt-4">
              <button
                onClick={onClose}
                type="button"
                className="inline-flex items-center mr-2 p-3 rounded-md bg-white border border-red-600 px-4 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="inline-flex items-center p-3 rounded-md bg-[#133F63] px-4 text-sm font-medium text-white shadow-sm hover:bg-[#133F63] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
