import React from 'react';
import InputForm from '../form/InputForm';
import SelectForm from '../form/SelectForm';
import { CreateUserInput, useGetDepartementsQuery } from '@/types/graphql-generated';

type UserFormProps = {
  onClose: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
    field: string,
  ) => void;
  id: string | null;
  error: string;
  formData: CreateUserInput;
};

export default function UserForm({
  handleSubmit,
  handleInputChange,
  onClose,
  formData,
  id,
  error,
}: UserFormProps) {
  const { data } = useGetDepartementsQuery();
  const userRole = [
    { key: 'admin', value: 'Admin' },
    { key: 'doctor', value: 'Doctor' },
    { key: 'agent', value: 'Agent' },
    { key: 'secretary', value: 'Secretary' },
  ];
  const userStatus = [
    { key: 'active', value: 'Active' },
    { key: 'inactive', value: 'Inactive' },
    { key: 'pending', value: 'Pending' },
  ];

  return (
    <section className="container mx-auto p-4 gap-4 h-screen w-2/5">
      <article className="bg-white mx-auto p-4 border border-borderColor rounded-sm">
        <h2 className="mb-3">{id ? 'Modifier un utilisateur' : 'Créer un nouvel utilisateur'}</h2>
        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <InputForm
            title="Nom"
            name="lastname"
            type="text"
            value={formData.lastname}
            placeholder="Nom"
            handle={e => handleInputChange(e, 'lastname')}
          />
          <InputForm
            title="Prénom"
            name="firstname"
            type="text"
            value={formData.firstname}
            placeholder="Prénom"
            handle={e => handleInputChange(e, 'firstname')}
          />
          <InputForm
            title="Email"
            name="Email"
            type="email"
            value={formData.email}
            placeholder="Email"
            handle={e => handleInputChange(e, 'email')}
          />
          <InputForm
            title="Password"
            name="password"
            type="password"
            value={formData.password}
            placeholder="Password"
            handle={e => handleInputChange(e, 'password')}
          />
          <SelectForm
            title="Service"
            name="departementId"
            option={
              data?.getDepartements?.map(department => ({
                key: department.id,
                value: department.label,
              })) || []
            }
            value={formData.departementId?.toString()}
            handle={e => handleInputChange(e, 'departementId')}
          />
          <SelectForm
            title="Role"
            name="role"
            option={userRole}
            value={formData.role ?? ''}
            handle={e => handleInputChange(e, 'role')}
          />
          <SelectForm
            title="Status"
            name="status"
            option={userStatus}
            value={formData.status ?? ''}
            handle={e => handleInputChange(e, 'status')}
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
