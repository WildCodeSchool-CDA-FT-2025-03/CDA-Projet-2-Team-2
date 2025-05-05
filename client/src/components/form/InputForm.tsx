import React from 'react';

type inputFormProps = {
  title: string;
  name: string;
  placeholder?: string;
  value: string;
  disabled?: boolean;
  handle: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function InputForm({ title, name, value, placeholder, disabled, handle }: inputFormProps) {
  return (
    <p>
      <label htmlFor="lastname">{title}</label>
      <input
        type="text"
        name={name}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={handle}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 my-2"
      />
    </p>
  );
}

export default InputForm;
