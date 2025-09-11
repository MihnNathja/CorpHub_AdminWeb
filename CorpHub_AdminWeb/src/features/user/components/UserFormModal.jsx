import { useState, useEffect } from "react";
import api from "../../../services/api";
import { useUserForm } from "../hooks/useUserForm";

const UserFormModal = ({ isOpen, onClose, onSubmit, user }) => {
  const { form, handleChange, handleSubmit, departments, roles } = useUserForm(isOpen, user, onSubmit);

  if (!isOpen) return null;

  const inputClass = "w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 transition-colors";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md text-gray-900 dark:text-gray-100 transition-colors">
        <h2 className="text-xl font-bold mb-4">{user ? "Edit User" : "Add User"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className={inputClass}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
            required
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">Select Role</option>
            {roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          {!user && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={inputClass}
              required
            />
          )}
          <select
            name="departmentId"
            value={form.departmentId}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select Department</option>
            {Array.isArray(departments) && departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-900 dark:text-gray-100 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded transition-colors"
            >
              {user ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
