import Pagination from '@/components/logs/Pagination';
import { useGetAllUsersQuery } from '@/types/graphql-generated';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function User() {
  const [currentPage, setCurrentPage] = useState(0);
  const usersPerPage = 8;

  const { loading, error, data } = useGetAllUsersQuery({
    variables: {
      page: currentPage,
      limit: usersPerPage,
    },
  });
  if (error) return <p>Error</p>;
  if (loading) return <p>Loading</p>;
  const users = data?.getAllUsers?.users || [];
  const totalUsers = data?.getAllUsers?.total || 0;

  const totalPages = Math.ceil(totalUsers / usersPerPage);
  const handlePaginatation = (pageNumber: number) => setCurrentPage(pageNumber);
  return (
    <main className="container  mx-auto pt-4 pr-12 pl-12 pb-12 flex overflow-hidden flex-col gap-4 h-screen">
      <header className="flex items-center mb-4">
        <h2 className="text-xl mr-5 font-semibold text-gray-700">Tableau de bord administrateur</h2>
        <Link className="bg-blue text-white px-4 py-2 rounded-md" to={'/admin/users/create'}>
          Nouvel utilistateur
        </Link>
      </header>
      <section className="bg-bgBodyColor items-center mb-4 h-full overflow-y-auto">
        <div className="bg-white m-4 w-2/5 relative border border-borderColor rounded-full">
          <input
            type="text"
            id="dep"
            className="w-full px-10 py-3 border border-borderColor rounded-full focus:outline-none focus:ring-1 focus:ring-borderColor"
            placeholder="Chercher un utilistateur"
          />
          <img
            src="/public/search-icon.svg"
            alt="search icon"
            className="absolute right-3 top-1/2 -translate-y-1/2"
          />
        </div>
        {users.map(({ id, firstname, lastname, email, status, departement }) => (
          <section
            key={id}
            className="flex px-3 py-3 m-4 bg-white border border-borderColor rounded-sm justify-between"
          >
            <p className="mt-auto mb-auto">
              {firstname} {lastname} - {email} - {departement.label}
            </p>
            <button
              className={`text-white px-5 py-2 rounded text-sm w-28 ${
                status === 'active' ? 'bg-bgActiveStatus' : 'bg-bgInActiveStatus'
              }`}
            >
              {status}
            </button>
          </section>
        ))}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePaginatation}
          totalItems={totalUsers}
          pageSize={usersPerPage}
        />
      </section>
    </main>
  );
}
