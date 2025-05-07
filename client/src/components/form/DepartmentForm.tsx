import React from 'react';
import InputForm from './InputForm';

type DepartmentFormProps = {
  onClose: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
  id: string | null;
  error: string;
  formData: {
    label: string;
    building: string;
    wing: string;
    level: string;
  };
};

export default function DepartmentForm({
  handleSubmit,
  handleInputChange,
  onClose,
  formData,
  id,
  error,
}: DepartmentFormProps) {
  return (
    <section className="container mx-auto p-4 gap-4 h-screen w-2/5">
      <article className="bg-white mx-auto p-4 border border-borderColor rounded-sm">
        <h2 className="mb-3">{id ? 'Modifier le service' : 'Créer un nouveau service'}</h2>
        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <InputForm
            title="Denomination"
            name="label"
            type="text"
            value={formData.label}
            placeholder="Denomination"
            handle={e => handleInputChange(e, 'label')}
          />
          <InputForm
            title="Batiment"
            name="building"
            type="text"
            value={formData.building}
            placeholder="Batiment"
            handle={e => handleInputChange(e, 'building')}
          />
          <InputForm
            title="Aile"
            name="wing"
            type="text"
            value={formData.wing}
            placeholder="Aile"
            handle={e => handleInputChange(e, 'wing')}
          />
          <InputForm
            title="Niveau"
            name="level"
            type="text"
            value={formData.level}
            placeholder="Niveau"
            handle={e => handleInputChange(e, 'level')}
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
              className="inline-flex items-center p-3 rounded-md bg-blue px-4 text-sm font-medium text-white shadow-sm hover:bg-blue focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {id ? 'Mettre à jour' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </article>
    </section>
  );
}
