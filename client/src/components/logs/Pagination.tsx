import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  pageSize: number;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
}: PaginationProps) {
  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-borderColor">
      <section className="text-sm text-gray-600">
        {startItem}-{endItem} sur {totalItems}
      </section>

      <section className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(0)}
          disabled={currentPage === 0}
          className="p-2 text-gray-400 hover:text-blue disabled:opacity-30 rounded transition-colors"
        >
          <ChevronsLeft size={16} />
        </button>

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="p-2 text-gray-400 hover:text-blue disabled:opacity-30 rounded transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        <span className="px-3 py-1 text-sm bg-lightBlue rounded">
          {currentPage + 1} / {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="p-2 text-gray-400 hover:text-blue disabled:opacity-30 rounded transition-colors"
        >
          <ChevronRight size={16} />
        </button>

        <button
          onClick={() => onPageChange(totalPages - 1)}
          disabled={currentPage >= totalPages - 1}
          className="p-2 text-gray-400 hover:text-blue disabled:opacity-30 rounded transition-colors"
        >
          <ChevronsRight size={16} />
        </button>
      </section>
    </div>
  );
}
