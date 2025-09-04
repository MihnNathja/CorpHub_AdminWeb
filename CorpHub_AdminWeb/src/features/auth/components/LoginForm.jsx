import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useLoginForm } from "../hooks/useLoginForm";

const LoginForm = () => {
  const { form, handleChange, handleSubmit, loading, error } = useLoginForm();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Admin Login
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <div className="relative">
            <EnvelopeIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         focus:border-blue-500 transition shadow-sm"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Password
          </label>
          <div className="relative">
            <LockClosedIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         focus:border-blue-500 transition shadow-sm"
            />
          </div>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-2 p-3 rounded-lg border border-red-300 
                         bg-red-50 text-red-700 text-sm shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M12 5a7 7 0 00-7 7v1a7 7 0 0014 0v-1a7 7 0 00-7-7z"
                />
              </svg>
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg 
                     hover:bg-blue-700 transition font-semibold shadow disabled:opacity-70"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
