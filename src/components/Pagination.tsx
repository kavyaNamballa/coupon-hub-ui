import React from "react";
import "../styles/Pagination.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  showPageSizeSelector?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  onPageSizeChange,
  showPageSizeSelector = false,
}) => {
  const pageSizeOptions = [5, 10, 20, 50];

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (onPageSizeChange) {
      onPageSizeChange(Number(event.target.value));
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        <span>
          Showing {currentPage * pageSize + 1} to{" "}
          {Math.min((currentPage + 1) * pageSize, totalElements)} of{" "}
          {totalElements} results
        </span>
      </div>

      <div className="pagination-controls">
        <button
          className="pagination-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Previous
        </button>

        <div className="page-numbers">
          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="page-dots">...</span>
              ) : (
                <button
                  className={`page-btn ${
                    currentPage === (page as number) - 1 ? "active" : ""
                  }`}
                  onClick={() => onPageChange((page as number) - 1)}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          className="pagination-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        >
          Next
        </button>
      </div>

      {showPageSizeSelector && onPageSizeChange && (
        <div className="page-size-selector">
          <label htmlFor="pageSize">Show:</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="page-size-select"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>per page</span>
        </div>
      )}
    </div>
  );
};

export default Pagination;
