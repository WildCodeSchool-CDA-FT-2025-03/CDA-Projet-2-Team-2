import { ChangeEvent } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="my-4">
      <input
        type="text"
        placeholder={placeholder || 'Rechercher...'}
        className="w-full border border-gray-300 p-2 rounded shadow-sm"
        value={value}
        onChange={handleChange}
        aria-label="Champ de recherche"
      />
    </div>
  );
}
