import React from 'react'

type InputProps = {
  label: string;
  name: string;
  type: string;
  value: string;
  handle: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function InputForm({label,name,type,value,handle} : InputProps) {
  return (
    <>
      <label htmlFor={name} className="block mt-2 text-sm/6 font-medium text-gray-900">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={handle}
        placeholder="Niveau"
        required
        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-grey-600 sm:text-sm/6"
      />
    </>
  );
}
