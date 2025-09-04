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
    onSubmit(form); // Gọi callback để submit lên API
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-xl shadow">
      <input
        type="text"
        name="fullName"
        placeholder="Full name"
        value={form.fullName}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="border p-2 w-full"
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
        className="border p-2 w-full"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Save
      </button>
    </form>
  );
};

export default UserForm;
