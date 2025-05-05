import InputForm from '@/components/form/InputForm';
import { useCreateDepartementMutation } from '@/types/graphql-generated';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
type CreateDepartmentType = {
  label: string;
  building: string;
  wing: string;
  level: string;
  status: string;
};
export default function CreateDepartment() {
  const navigate = useNavigate();
  const [errorr, setError] = useState('');
  const [formData, setFormData] = useState<CreateDepartmentType>({
    label: '',
    building: '',
    wing: '',
    level: '',
    status: '',
  });
  const [createDepartement] = useCreateDepartementMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      await createDepartement({
        variables: { data: formData },
      });
      navigate('/department');
    } catch (error) {
      setError(error instanceof Error ? error.message : '');
    }
  };
  return (
    <div className="container mx-auto p-4 gap-4 h-screen w-2/5">
      <h2 className="p-3 flex items-center">Créer un nouveau service</h2>
      <div className="bg-white mx-auto p-4 ">
        <h3>Information du service</h3>
        {errorr && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            {errorr}
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="w-4/5  mt-2">
            <label htmlFor="serviceName" className="block text-sm/6 font-medium text-gray-900">
              Denomination
            </label>
              <input
                id="serviceName"
                name="label"
                type="text"
                value={formData.label}
                onChange={e =>
                  setFormData({
                    ...formData,
                    label: e.target.value,
                  })
                }
                placeholder="Denomination"
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-grey-600 sm:text-sm/6"
              />
            <label htmlFor="building" className="block mt-2 text-sm/6 font-medium text-gray-900">
              Batiment
            </label>
              <input
                id="building"
                name="building"
                type="text"
                value={formData.building}
                onChange={e =>
                  setFormData({
                    ...formData,
                    building: e.target.value,
                  })
                }
                placeholder="Batiment"
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-grey-600 sm:text-sm/6"
              />
            <label htmlFor="wing" className="block mt-2 text-sm/6 font-medium text-gray-900">
              Aile
            </label>
              <input
                id="wing"
                name="wing"
                type="text"
                value={formData.wing}
                onChange={e =>
                  setFormData({
                    ...formData,
                    wing: e.target.value,
                  })
                }
                placeholder="Aile"
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-grey-600 sm:text-sm/6"
            />
            <InputForm
              label="Niveau"
              name="level"
              type="text"
              value={formData.level} 
              handle={(e) =>
                setFormData({
                  ...formData,
                  label: e.target.value,
                })
              }
            />

            <label htmlFor="status" className="block mt-2 text-sm/6 font-medium text-gray-900">
              Status
            </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={e =>
                  setFormData({
                    ...formData,
                    status: e.target.value,
                  })
                }
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-grey-600 sm:text-sm/6"
              >
                <option value="active" selected>
                  Active
                </option>
                <option value="inactive">Inactive</option>
              </select>
            <div className="flex justify-end p-2 mt-4">
              <Link to="/department">
                <button
                  type="button"
                  className="inline-flex items-center mr-2 p-3 rounded-md bg-white border border-red-600 px-4 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Annuler
                </button>
              </Link>
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
