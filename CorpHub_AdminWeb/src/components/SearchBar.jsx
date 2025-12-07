// src/components/SearchBar.jsx
import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon, XMarkIcon, ClockIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const SearchBar = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Mock recent searches - replace with real data from localStorage or API
  const recentSearches = ["Team meeting", "Project report", "Employee data"];

  // Mock trending searches - replace with real data from API
  const trendingSearches = ["Dashboard", "Tickets", "Calendar"];

  useEffect(() => {
    // Auto focus on mount
    const timer = setTimeout(() => setIsFocused(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (searchTerm) => {
    setQuery(searchTerm);
    setShowResults(false);
    // Implement actual search logic here
    console.log("Searching for:", searchTerm);
  };

  return (
    <div className="relative w-full">
      {/* Search Input Container */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="relative"
      >
        {/* Search Icon */}
        <motion.div
          animate={{
            scale: isFocused ? 1.1 : 1,
            color: isFocused ? "#3B82F6" : "#9CA3AF",
          }}
          className="absolute left-3 top-1/2 translate-y-[-50%] z-10"
        >
          {/* <MagnifyingGlassIcon className="h-5 w-5" /> */}
        </motion.div>

        {/* Input Field */}
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(e.target.value.length > 0 || isFocused);
          }}
          onFocus={() => {
            setIsFocused(true);
            setShowResults(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            setTimeout(() => setShowResults(false), 200);
          }}
          placeholder="Search anything..."
          autoFocus
          className="w-full pl-10 pr-20 py-2.5 rounded-xl border-2 transition-all duration-200
            bg-white dark:bg-gray-800 
            text-gray-900 dark:text-gray-100 
            border-gray-200 dark:border-gray-700
            focus:border-blue-500 dark:focus:border-blue-400
            focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/20
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            shadow-sm hover:shadow-md focus:shadow-lg"
        />

        {/* Right Actions */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">


          {/* Close button */}
          {onClose && (
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Close search"
            >
              <XMarkIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
          >
            {query ? (
              /* Search Results */
              <div className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">
                  Search results for "{query}"
                </p>
                <div className="space-y-2">
                  {/* Mock results - replace with real search results */}
                  {[1, 2, 3].map((item) => (
                    <motion.button
                      key={item}
                      whileHover={{ x: 4 }}
                      onClick={() => handleSearch(`Result ${item}`)}
                      className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        Search Result {item}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Description for result {item}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              /* Quick Actions */
              <div className="p-4 space-y-4">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <ClockIcon className="w-4 h-4 text-gray-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Recent
                      </h4>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((search, idx) => (
                        <motion.button
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ x: 4 }}
                          onClick={() => handleSearch(search)}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-sm text-gray-700 dark:text-gray-300"
                        >
                          {search}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700" />

                {/* Trending Searches */}
                {trendingSearches.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <ArrowTrendingUpIcon className="w-4 h-4 text-blue-500" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Trending
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((search, idx) => (
                        <motion.button
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSearch(search)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-sm text-blue-600 dark:text-blue-400 font-medium transition-colors"
                        >
                          {search}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
