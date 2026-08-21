import '../styles/pagination.css';

export default function Pagination({page, totalPages, onPageChange, pageLimit = 10}) {

    const startPage = Math.floor((page - 1) / pageLimit) * pageLimit + 1
    const endPage = Math.min(startPage + pageLimit - 1, totalPages);

    return (
        <div className="pagination">
            {page > pageLimit && (
                <button
                    onClick={() => onPageChange(startPage - 1)}
                >
                    이전
                </button>
            )}

            {Array.from(
                { length: endPage - startPage + 1 },
                (_, i) => i + startPage
            ).map((pageNumber) => (
                <button
                    key={pageNumber}
                    className={
                        page === pageNumber
                            ? "pagination-active" : ""
                    }
                    onClick={() => onPageChange(pageNumber)}
                >
                    {pageNumber}
                </button>
            ))}

            {endPage < totalPages && (
                <button
                    onClick={() => onPageChange(endPage + 1)}
                >
                    다음
                </button>
            )}
        </div>
    )
}