import { useGetAllUsersQuery } from '@/types/graphql-generated';

export default function User() {
  const { loading, error, data } = useGetAllUsersQuery();

  if (error) return <p>Error</p>;
  if (loading) return <p>Loading</p>;

  return (
    <main className="container p-12 mx-auto p-4 flex flex-col gap-4 h-screen">
      <header className="flex items-center mb-4">
        <h2 className="text-xl mr-5 font-semibold text-gray-700">Tableau de bord administrateur</h2>
      </header>
      <section className="bg-bgBodyColor items-center mb-4">
        <div className="bg-white m-4 w-2/5 relative border border-borderColor rounded-full">
          <input
            type="text"
            id="dep"
            className="w-full px-10 py-3 border border-borderColor rounded-full focus:outline-none focus:ring-1 focus:ring-borderColor"
            placeholder="Chercher un service"
          />
          <img
            src="/public/search-icon.svg"
            alt="search icon"
            className="absolute right-3 top-1/2 -translate-y-1/2"
          />
        </div>
        {data?.getAllUsers?.map(({ id, firstname, lastname, email, status, departement }) => (
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
      </section>
    </main>
  );
}
