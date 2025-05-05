import { useGetDepartementsQuery } from "@/types/graphql-generated";

export default function Department() {
  const { loading, error, data } = useGetDepartementsQuery();
  if (error) return <p>Error</p>;
  if (loading) return <p>Loading</p>;
  
  return (
    <>
      <div className="container mx-auto p-4 flex flex-col md:flex-row gap-4 h-screen">
        <div className="w-full align-center flex flex-col gap-4 h-full p-12">
          <div className="flex items-center mb-4">
            <h2 className="text-xl mr-5 m- font-semibold text-gray-700">Gestion des services</h2>
            <button className="bg-[#133F63] text-white px-4 py-2 rounded-md">
              Nouveau service
            </button>
          </div>
          <div className="bg-[rgba(255,253,250,0.5)]  items-center mb-4">
            <div className="bg-white m-4 w-2/5 relative border border-[rgba(255,253,250,0.5)] rounded-full">
              <input
                type="text"
                id="dep"
                // value={}
                // onChange={}
                className="w-full px-10 py-3 border border-[rgba(255,253,250,0.5)] rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Chercher un service"
              />
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            {
              data?.getDepartements.map((department) => (
                <div key={department.id} className="flex px-3 py-3 m-4 bg-white justify-between px-4 py-2">
                  <p>{department.label} - Bat {department.building} - Aile {department.wing} - {department.level}</p>
                  <span
                    className={`text-white px-5 py-1 rounded text-sm ${department.status === "active" ? "bg-[#49AD7B]" : "bg-[#FC666A]"
                      }`}
                  >
                    {department.status}
                  </span>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </>
  );
}
