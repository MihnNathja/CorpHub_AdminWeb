import { useState } from "react";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useLoginForm } from "../hooks/useLoginForm";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";


const LoginForm = ({ loading, error }) => {
  const { form, handleChange, handleSubmit } = useLoginForm();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="text-gray-800">
      {/* Heading */}
      <div className="mb-6 text-center md:text-left">
        <h2 className="text-2xl font-bold">CorpHub Admin</h2>
        <p className="text-gray-500 text-sm">
          Quản lý hoạt động nội bộ công ty
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label className="block text-sm font-semibold mb-1">Email</label>
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
                         focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold mb-1">Password</label>
          <div className="relative">
            <LockClosedIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2 border rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-purple-500 
                         focus:border-purple-500 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
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
                         bg-red-100 text-red-600 text-sm"
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
                  d="M12 9v2m0 4h.01M12 5a7 7 0 00-7 7v1a7 7 0 0014 0v-1a7-7 0 00-7-7z"
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
          className="w-full py-3 rounded-lg font-semibold shadow-md
                     bg-blue-600 hover:bg-blue-700
                     transition text-white disabled:opacity-70"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-xs text-gray-400 mt-8">
        © {new Date().getFullYear()} CorpHub. All rights reserved.
      </p>
    </div>
  );
};

export default LoginForm;
