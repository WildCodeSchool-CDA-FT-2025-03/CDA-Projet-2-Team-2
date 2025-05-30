export type PaginationControlsProps = {
  currentPage: number;
  onPageChange: (newPage: number) => void;
  pageSize: number;
  totalItems: number;
  className?: string;
};
