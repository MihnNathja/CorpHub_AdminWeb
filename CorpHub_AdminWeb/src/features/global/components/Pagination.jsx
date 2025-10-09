import React from "react";

const Pagination = ({ page, setPage, totalPages }) => {
  return (
    <div className="mt-4 flex justify-center gap-2 text-gray-900 dark:text-gray-100">
      <button
        disabled={page <= 0}
        onClick={() => setPage(page - 1)}
        className="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors"
      >
        Previous
      </button>
      <span>
        Page {page + 1} / {totalPages}
      </span>
      <button
        disabled={page + 1 >= totalPages}
        onClick={() => {
          setPage(page + 1);
          console.log(totalPages);
        }}
        className="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
