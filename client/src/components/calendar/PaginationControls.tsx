import { PaginationControlsProps } from '@/types/PaginationControlsProps.type';

function PaginationControls({
  currentPage,
  onPageChange,
  pageSize,
  totalItems,
  className = '',
}: PaginationControlsProps) {
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePrev = () => {
    if (currentPage > 0) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if ((currentPage + 1) * pageSize < totalItems) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <section className={`flex justify-between items-center gap-4 ${className}`}>
      <button
        onClick={handlePrev}
        disabled={currentPage === 0}
        className="text-blue rounded disabled:opacity-50 cursor-pointer"
        aria-label="Page précédente"
      >
        ◀
      </button>

      {/* 👓 role="status" : Marks the element as containing information that may change and must be announced by the screen reader. */}
      {/* 👓 aria-atomic="true": This means that when the content of the element changes, the entire element will be read, even if only part of it has changed.*/}
      <span role="status" aria-atomic="true">
        {`${currentPage * pageSize + 1} à ${Math.min((currentPage + 1) * pageSize, totalItems)} sur ${totalItems}`}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage + 1 >= totalPages}
        className="text-blue rounded disabled:opacity-50 cursor-pointer"
        aria-label="Page suivante"
      >
        ▶
      </button>
    </section>
  );
}

export default PaginationControls;
