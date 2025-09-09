import { useState } from "react";

const UserForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    role: "",
    departmentId: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const inputClass = "border p-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 rounded transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow transition-colors">
      <input
        type="text"
        name="fullName"
        placeholder="Full name"
        value={form.fullName}
        onChange={handleChange}
        className={inputClass}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className={inputClass}
      />
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className={inputClass}
      >
        <option value="">-- Select role --</option>
        <option value="employee">Employee</option>
        <option value="manager">Manager</option>
        <option value="admin">Admin</option>
      </select>
      <input
        type="text"
        name="departmentId"
        placeholder="Department ID"
        value={form.departmentId}
        onChange={handleChange}
        className={inputClass}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className={inputClass}
      />
      <button
        type="submit"
        className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
      >
        Save
      </button>
    </form>
  );
};

export default UserForm;
