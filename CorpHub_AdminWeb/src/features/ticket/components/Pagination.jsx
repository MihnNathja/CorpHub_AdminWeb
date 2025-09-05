import React from "react";

const Pagination = ({ page, setPage, totalPages }) => {
  return (
    <div className="mt-4 flex justify-center gap-2">
      <button
        disabled={page <= 1}
        onClick={() => setPage(page - 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span>
        Page {page} / {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={() => setPage(page + 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
