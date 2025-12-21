// src/components/UserProfile.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutAsync } from "../features/auth/store/authSlice";
import {
  UserCircle,
  LogOut,
  Settings,
  ChevronDown,
  Mail,
  Shield,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import defaultAvatar from "../assets/defaultAvatar.jpg";

const UserProfile = ({ user }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutAsync());
    navigate("/login", { replace: true });
  };

  const handleEditProfile = () => {
    setOpen(false);
    navigate("/profile");
  };

  const avatarUrl = user?.avatar;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
      >
        {/* Avatar with status indicator */}
        <div className="relative">
          <motion.div
            animate={{
              boxShadow: open
                ? "0 0 0 3px rgba(59, 130, 246, 0.3)"
                : "0 0 0 0px rgba(59, 130, 246, 0)",
            }}
            className="relative rounded-full"
          >
            <img
              src={avatarUrl || defaultAvatar}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
            />
            {/* Online status indicator */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
          </motion.div>
        </div>

        {/* User info */}
        <div className="hidden sm:block text-left">
          <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 leading-tight">
            {user?.fullName || "User"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user?.role || "Member"}
          </p>
        </div>

        {/* Chevron icon */}
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
          >
            {/* User Info Header */}
            <div className="relative bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-6 text-white overflow-hidden">
              {/* Animated background */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl"
              />

              <div className="relative flex items-center gap-4">
                <div className="relative">
                  <img
                    src={avatarUrl || defaultAvatar}
                    alt="avatar"
                    className="w-16 h-16 rounded-full object-cover border-3 border-white/30 shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 p-1.5 bg-emerald-500 rounded-full border-2 border-white">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate">
                    {user?.fullName || "User"}
                  </h3>
                  {user?.email && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <Mail className="w-3.5 h-3.5 opacity-80" />
                      <p className="text-sm text-white/90 truncate">
                        {user.email}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {/* Profile */}
              <motion.button
                whileHover={{ x: 4 }}
                onClick={handleEditProfile}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all text-left group"
              >
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                  <Settings className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                    Edit Profile
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Update your information
                  </p>
                </div>
              </motion.button>

              {/* Account Settings (optional) */}
              {/* <motion.button
                whileHover={{ x: 4 }}
                onClick={() => {
                  setOpen(false);
                  navigate("/settings");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all text-left group"
              >
                <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-colors">
                  <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                    Account Settings
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Privacy & security
                  </p>
                </div>
              </motion.button> */}

              {/* Divider */}
              <div className="my-2 border-t border-gray-200 dark:border-gray-700"></div>

              {/* Logout */}
              <motion.button
                whileHover={{ x: 4 }}
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-left group"
              >
                <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30 group-hover:bg-red-100 dark:group-hover:bg-red-900/50 transition-colors">
                  <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-red-600 dark:text-red-400">
                    Logout
                  </p>
                  <p className="text-xs text-red-500 dark:text-red-500">
                    Sign out of your account
                  </p>
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;
