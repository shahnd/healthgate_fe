import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export default function CustomPagination({ page, totalPages, onPageChange, pageLimit = 3 }) {
  const startPage = Math.floor((page - 1) / pageLimit) * pageLimit + 1;
  const endPage = Math.min(startPage + pageLimit - 1, totalPages);

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => i + startPage
  );

  const handleClick = (e, targetPage) => {
    e.preventDefault();
    onPageChange(targetPage);
  };

  return (
    <Pagination>
      <PaginationContent>
        {startPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => handleClick(e, endPage - 1)}
            />
          </PaginationItem>
        )}

        {pageNumbers.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              href="#"
              isActive={page === pageNumber}
              onClick={(e) => handleClick(e, pageNumber)}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}

        {endPage < totalPages && (
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => handleClick(e, endPage + 1)}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}