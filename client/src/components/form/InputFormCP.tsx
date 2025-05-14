import SearchBarCP from './SearchBarCP';

type inputFormProps = {
  handle: (cp: string, ville: string) => void;
  value: string;
  valuecity: string;
};

function InputFormCP({ handle, value, valuecity }: inputFormProps) {
  const clickInput = (e: React.MouseEvent<HTMLInputElement>) => {
    const resultList = document.querySelector('.search-bar') as HTMLDivElement;
    resultList.classList.toggle('hidden');
    const input = e.currentTarget as HTMLInputElement;
    const newInput = document.getElementById('new_postal_code') as HTMLInputElement;
    newInput.focus();
    if (input && newInput) {
      newInput.value = input.value;
    }
  };

  return (
    <>
      <section>
        <label htmlFor="postal_code">Code postale</label>
        <input
          type="text"
          name="postal_code"
          id="postal_code"
          value={value}
          readOnly={true}
          placeholder="Code postale"
          onClick={clickInput}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 my-2"
        />
        <SearchBarCP cpdefault={value} handle={handle} />
      </section>
      <section>
        <label htmlFor="city">Ville</label>
        <input
          type="text"
          name="city"
          id="city"
          value={valuecity}
          placeholder="Ville"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 my-2"
        />
      </section>
    </>
  );
}

export default InputFormCP;
