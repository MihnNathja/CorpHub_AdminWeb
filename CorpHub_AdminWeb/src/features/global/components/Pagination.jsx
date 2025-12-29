import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const Pagination = ({ page, setPage, totalPages }) => {
  const isFirstPage = page <= 0;
  const isLastPage = page + 1 >= totalPages;

  const handlePrevious = () => {
    if (!isFirstPage) setPage(page - 1);
  };

  const handleNext = () => {
    if (!isLastPage) setPage(page + 1);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(0, page - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    if (startPage > 0) {
      pages.push(0);
      if (startPage > 1) pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) pages.push("...");
      pages.push(totalPages - 1);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
    >
      {/* Previous Button */}
      <motion.button
        whileHover={{ scale: isFirstPage ? 1 : 1.05 }}
        whileTap={{ scale: isFirstPage ? 1 : 0.95 }}
        onClick={handlePrevious}
        disabled={isFirstPage}
        className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all border-2 ${isFirstPage
          ? "border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed bg-gray-50 dark:bg-gray-800/30"
          : "border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 shadow-sm hover:shadow-md"
          }`}
      >
        <ChevronLeftIcon className="w-5 h-5" />
        <span className="hidden sm:inline">Previous</span>
      </motion.button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {pageNumbers.map((pageNum, idx) => (
          <React.Fragment key={idx}>
            {pageNum === "..." ? (
              <span className="px-2 py-2 text-gray-500 dark:text-gray-400 text-sm">
                ...
              </span>
            ) : (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPage(pageNum)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold text-sm transition-all border-2 ${pageNum === page
                  ? "border-blue-600 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  }`}
              >
                {pageNum + 1}
              </motion.button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Info */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Page
        </span>
        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
          {page + 1}
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          / {totalPages}
        </span>
      </div>

      {/* Next Button */}
      <motion.button
        whileHover={{ scale: isLastPage ? 1 : 1.05 }}
        whileTap={{ scale: isLastPage ? 1 : 0.95 }}
        onClick={handleNext}
        disabled={isLastPage}
        className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all border-2 ${isLastPage
          ? "border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed bg-gray-50 dark:bg-gray-800/30"
          : "border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 shadow-sm hover:shadow-md"
          }`}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRightIcon className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
};

export default Pagination;