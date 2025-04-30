// Définition du type des props du composant avec une contrainte sur T
type ModuleListProps<T extends { id: string | number }> = {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
};

export default function ModuleList<T extends { id: string | number }>({
  data,
  renderItem,
}: ModuleListProps<T>) {
  return (
    <ul className="border-l-4 border-blue rounded-md shadow-sm divide-y divide-gray-100 w-full max-w-md mx-auto bg-white space-y-2">
      {data.map((item, index) => (
        <li key={item.id} className={`px-4 py-3 ${index % 2 === 0 ? 'bg-white' : 'bg-lightBlue'}`}>
          {/* La fonction "renderItem" permet de personnaliser l'affichage de chaque élément */}
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
}
