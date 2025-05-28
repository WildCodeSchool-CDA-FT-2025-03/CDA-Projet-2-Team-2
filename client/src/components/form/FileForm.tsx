import { ChangeEvent } from 'react';

type inputFormProps = {
  title: string;
  name: string;
  placeholder?: string;
  value: string | File;
  disabled?: boolean;
  required?: boolean;
  type?: string;
  handle: (e: ChangeEvent<HTMLInputElement>) => void;
};

function FileForm({ title, name, placeholder, disabled, required, handle }: inputFormProps) {
  return (
    <section>
      <label htmlFor={name}>
        {title}
        {required ? ' *' : ''}
      </label>
      <input
        type="file"
        name={name}
        id={name}
        onChange={handle}
        placeholder={placeholder}
        required={required || false}
        disabled={disabled}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 my-2"
      />
    </section>
  );
}

export default FileForm;
