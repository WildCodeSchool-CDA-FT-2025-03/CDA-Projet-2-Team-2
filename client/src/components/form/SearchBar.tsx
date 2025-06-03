import { useEffect, useRef, useState } from 'react';

type SearchBarProps<T> = {
  placeholder: string;
  getSearchResults: (query: string) => Promise<T[]>;
  children: (item: T, onSelect: () => void) => React.ReactNode;
  getKey: (item: T) => string | number;
};

export default function SearchBar<T>({
  placeholder,
  getSearchResults,
  children,
  getKey,
}: SearchBarProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clickOutsideRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (clickOutsideRef.current && !clickOutsideRef.current.contains(event.target as Node)) {
      setIsOpen(false);
      setQuery('');
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await getSearchResults(query);
        setResults(res);
      } catch {
        setError('Erreur lors de la recherche.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, getSearchResults]);

  return (
    <div ref={clickOutsideRef} className="relative w-full max-w-xs ml-auto">
      <input
        type="text"
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        placeholder={placeholder}
        className="w-full rounded-full border border-borderColor bg-white pl-4 pr-10 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <img
        src="/search-icon.svg"
        alt="Rechercher"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 pointer-events-none"
      />

      {isOpen && query.length >= 2 && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-80 overflow-y-auto">
          {loading && <p className="p-2 text-sm text-gray-500">Chargement...</p>}
          {error && <p className="p-2 text-sm text-red-500">{error}</p>}
          {!loading && results.length === 0 && (
            <p className="p-2 text-sm text-gray-500">Aucun résultat trouvé.</p>
          )}
          <ul>
            {results.map(item => (
              <li key={getKey(item)}>
                {children(item, () => {
                  setQuery('');
                  setIsOpen(false);
                })}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
