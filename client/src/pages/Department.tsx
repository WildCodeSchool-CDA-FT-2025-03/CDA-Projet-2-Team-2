import { useGetDepartementsQuery } from '@/types/graphql-generated';
import { useState } from 'react';
import CreateDepartmentModal from '../components/CreateDepartmentModal';
import DepartmentStatusModal from '@/components/DepartmentStatusModal';

export default function Department() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState<string | null>(null);
  const [departmentId, setDepartmentId] = useState<string | null>(null);
  const { loading, error, data } = useGetDepartementsQuery();

  if (error) return <p>Error</p>;
  if (loading) return <p>Loading</p>;

  return (
    <>
      <div className="container mx-auto p-4 flex flex-col md:flex-row gap-4 h-screen">
        <div className="w-full align-center flex flex-col gap-4 h-full p-12">
          <div className="flex items-center mb-4">
            <h2 className="text-xl mr-5 m- font-semibold text-gray-700">Gestion des services</h2>
            <>
              <button
                className="bg-blue text-white px-4 py-2 rounded-md"
                onClick={() => setShowCreateModal(true)}
              >
                Nouveau service
              </button>
              {showCreateModal && (
                <div className="fixed inset-0 z-50 flex justify-center  items-center bg-bgModalColor backdrop-blur-xs">
                  <CreateDepartmentModal
                    id={departmentId}
                    onClose={() => {
                      setShowCreateModal(false);
                      setDepartmentId(null);
                    }}
                  />
                </div>
              )}
            </>
          </div>
          <div className="bg-bgBodyColor  items-center mb-4">
            <div className="bg-white m-4 w-2/5 relative border border-bgBodyColor rounded-full">
              <input
                type="text"
                id="dep"
                className="w-full px-10 py-3 border border-bgBodyColor rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Chercher un service"
              />
              <img
                src="/public/search-icon.svg"
                alt="search icon"
                className="absolute right-3 top-1/2 -translate-y-1/2"
              />
            </div>
            {data?.getDepartements.map(department => (
              <div
                key={department.id}
                className="flex px-3 py-3 m-4 bg-white border border-bgBodyColor rounded-sm justify-between px-4 py-2"
              >
                <p>
                  {department.label} - Bat {department.building} - Aile {department.wing} -{' '}
                  {department.level}
                </p>
                <div>
                  <button
                    className={`text-white mr-3 px-5 py-1 rounded text-sm bg-bgEdit`}
                    onClick={() => {
                      setShowCreateModal(true);
                      setDepartmentId(department.id);
                    }}
                  >
                    Modifier
                  </button>
                  <button
                    className={`text-white px-5 py-1 rounded text-sm ${
                      department.status === 'active' ? 'bg-bgActiveStatus' : 'bg-bgInActiveStatus'
                    }`}
                    onClick={() => setShowStatusModal(department.id)}
                  >
                    {department.status}
                  </button>
                </div>
                {showStatusModal === department.id && (
                  <DepartmentStatusModal
                    department={department}
                    onClose={() => setShowStatusModal(null)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
