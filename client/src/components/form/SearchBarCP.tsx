import { ChangeEvent, useState, KeyboardEvent } from 'react';
import { useGetCityByCpQuery } from '@/types/graphql-generated';

type inputFormProps = {
  cpdefault: string;
  handle: (cp: string, ville: string) => void;
};

function SearchBarCP({ cpdefault, handle }: inputFormProps) {
  const [postalCode, setPostalCode] = useState(cpdefault);
  const GetCityByCpQuery = useGetCityByCpQuery({
    variables: { postalCode: postalCode },
  });

  const newResults = GetCityByCpQuery.data?.getCityByCP.map(result => ({
    id: result.id,
    postalCode: result.postal_code,
    city: result.city,
  }));

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, postalCode: string, city: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      clickResult(postalCode, city);
    }
  };

  const handleChangeCP = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (input && input.length === 5) {
      setPostalCode(input);
      GetCityByCpQuery.refetch();
    }
  };

  const clickResult = (postalCode: string, city: string) => {
    handle(postalCode, city);
    const resultList = document.querySelector('.search-bar') as HTMLDivElement;
    resultList.classList.toggle('hidden');
  };

  const clickClose = () => {
    const resultList = document.querySelector('.search-bar') as HTMLDivElement;
    resultList.classList.toggle('hidden');
  };

  return (
    <div className="absolute left-0 right-0 mt-1 z-10 bg-gray-300 shadow-sm p-2 mb-1 search-bar hidden">
      <div className="flex items-center justify-between bg-white border-b border-gray-300 rounded-lg mb-2 p-2">
        <div className="bg-white w-2/5 relative border border-borderColor rounded-full p-2 m-0">
          <input
            className="w-full bg-transparent outline-none focus:ring-0 focus:border-none"
            type="text"
            name="new_postal_code"
            id="new_postal_code"
            placeholder="Code postale"
            onChange={handleChangeCP}
          />
          <img
            src="/public/search-icon.svg"
            alt="search icon"
            className="absolute right-3 top-1/2 -translate-y-1/2"
          />
        </div>
        <input
          type="button"
          onClick={clickClose}
          value="x fermer"
          className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors duration-200 cursor-pointer"
        />
      </div>
      <div className="result-list bg-white border border-gray-300 rounded-lg shadow-sm max-h-60 overflow-y-auto">
        <div className="result-item px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
          Liste des villes
        </div>
        {newResults &&
          newResults.map(result => (
            <div
              key={`${result.id}`}
              className="result-item px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              role="button"
              tabIndex={0}
              onClick={() => clickResult(result.postalCode, result.city)}
              onKeyDown={e => handleKeyDown(e, result.postalCode, result.city)}
            >
              {result.postalCode} - {result.city}
            </div>
          ))}
      </div>
    </div>
  );
}

export default SearchBarCP;
