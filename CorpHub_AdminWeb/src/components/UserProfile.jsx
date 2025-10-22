// src/components/UserProfile.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutAsync } from "../features/auth/store/authSlice";
import { UserCircle } from "lucide-react";
import defaultAvatar from "../assets/defaultAvatar.jpg";

const UserProfile = ({ user }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Click ngoài dropdown để đóng
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
    navigate("/settings"); // hoặc route edit profile của bạn
  };

  const avatarUrl = user?.avatar;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          console.log(user);
          setOpen(!open);
        }}
        className="flex items-center gap-2 focus:outline-none"
      >
        {/* Avatar */}

        <img
          src={avatarUrl || defaultAvatar}
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover"
        />

        <span className="font-medium text-gray-800 dark:text-gray-200 transition-colors">
          {user?.fullName || "User"}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900/90 rounded-xl shadow-dropdown z-50 animate-fade-in transition-colors backdrop-blur-sm">
          <button
            onClick={handleEditProfile}
            className="w-full text-left dark:text-gray-100 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors"
          >
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left dark:text-gray-100 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
