import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployee } from "../hooks/useEmployee";
import Pagination from "../../global/components/Pagination";
import defaultAvatar from "../../../assets/defaultAvatar.jpg";
import { EyeIcon } from "lucide-react";
import StatCard from "../../global/components/StatCard";

const EmployeeTable = () => {
  const { data, setPage, totalPages, page, sendCreateUserTicket } =
    useEmployee();
  const employees = data || [];
  const navigate = useNavigate();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const toggleSelect = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const openCreateForm = () => {
    if (selectedUsers.length === 0)
      return alert("Please select at least one employee!");
    setShowCreateForm(true);
  };
  const handleSendRequest = () => {
    sendCreateUserTicket(selectedUsers);
    setShowCreateForm(false);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl transition-colors border border-gray-100 dark:border-gray-700 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Employee list
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            View, select, and send account creation requests for employees
            without accounts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden md:inline-flex items-center gap-2 rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-xs font-semibold text-gray-600 dark:text-gray-200 border border-gray-200 dark:border-gray-600">
            Selected {selectedUsers.length} /{" "}
            {employees.filter((e) => !e.user).length} without account
          </span>
          <button
            onClick={openCreateForm}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition ${
              selectedUsers.length > 0
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            disabled={selectedUsers.length === 0}
          >
            Send account creation request
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-left text-gray-700 dark:text-gray-100">
              <th className="p-3 text-center w-12">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked)
                      setSelectedUsers(
                        employees
                          .filter((emp) => !emp.user)
                          .map((emp) => emp.id)
                      );
                    else setSelectedUsers([]);
                  }}
                  checked={
                    employees.filter((e) => !e.user).length > 0 &&
                    selectedUsers.length ===
                      employees.filter((e) => !e.user).length
                  }
                />
              </th>
              <th className="p-3">Avatar</th>
              <th className="p-3">Full name</th>
              <th className="p-3">Department</th>
              <th className="p-3">Role</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
            {employees.length === 0 && (
              <tr>
                <td colSpan={9} className="p-6 text-center text-gray-500">
                  No employee data.
                </td>
              </tr>
            )}
            {employees.map((emp) => (
              <tr
                key={emp.id}
                className="hover:bg-indigo-50/60 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="p-3 text-center">
                  {!emp.user ? (
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(emp.id)}
                      onChange={() => toggleSelect(emp.id)}
                    />
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={emp.avatarUrl || defaultAvatar}
                      alt={emp.fullName}
                      className="h-11 w-11 rounded-full object-cover border border-gray-200 dark:border-gray-700 shadow-sm"
                    />
                    <div className="flex flex-col text-xs text-gray-500 dark:text-gray-300">
                      {emp.code && <span>Code: {emp.code}</span>}
                    </div>
                  </div>
                </td>
                <td className="p-3 font-medium text-gray-800 dark:text-gray-100">
                  {emp.fullName}
                </td>
                <td className="p-3 text-gray-700 dark:text-gray-200">
                  {emp.departmentName}
                </td>
                <td className="p-3 text-gray-700 dark:text-gray-200">
                  {emp.user?.roleName || "-"}
                </td>
                <td className="p-3 text-gray-700 dark:text-gray-200">
                  {emp.personalEmail}
                </td>
                <td className="p-3 text-gray-700 dark:text-gray-200">
                  {emp.phone}
                </td>
                <td className="p-3 text-center">
                  {emp.user ? (
                    <StatCard
                      label={emp.user.active ? "Active" : "Inactive"}
                      colors={{
                        Active: "bg-green-100 text-green-700",
                        Inactive: "bg-red-100 text-red-700",
                      }}
                    />
                  ) : (
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                      No account
                    </span>
                  )}
                </td>
                <td className="p-3 text-center">
                  <button
                    type="button"
                    onClick={() => navigate(`/employees/${emp.id}`)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full border border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-500/40 dark:text-indigo-200 dark:hover:bg-indigo-900/30 transition"
                  >
                    <EyeIcon className="h-4 w-4" /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <Pagination setPage={setPage} totalPages={totalPages} page={page} />
      </div>

      {/* Account creation modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-lg shadow-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-gray-100">
              Send account creation request
            </h3>

            <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
              This will send an account creation request for{" "}
              {selectedUsers.length} employees:
            </p>
            <ul className="list-disc ml-6 mb-4 text-sm text-gray-800 dark:text-gray-100 space-y-1">
              {employees
                .filter((e) => selectedUsers.includes(e.id))
                .map((e) => (
                  <li key={e.id}>{e.fullName}</li>
                ))}
            </ul>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSendRequest}
                className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 shadow-sm"
              >
                Send request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
