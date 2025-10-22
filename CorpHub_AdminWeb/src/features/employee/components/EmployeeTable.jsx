import { useState } from "react";
import { useEmployee } from "../hooks/useEmployee";
import Pagination from "../../global/components/Pagination";
import defaultAvatar from "../../../assets/defaultAvatar.jpg";
import { EyeIcon } from "lucide-react";
import StatCard from "../../global/components/StatCard";
import EmployeeDetailModal from "./EmployeeDetailModal";

const EmployeeTable = () => {
  const { data, setPage, totalPages, page, sendCreateUserTicket } =
    useEmployee();
  const employees = data;
  const [selected, setSelected] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const toggleSelect = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const openCreateForm = () => {
    if (selectedUsers.length === 0)
      return alert("Hãy chọn ít nhất 1 nhân viên!");
    setShowCreateForm(true);
  };
  const handleSendRequest = () => {
    sendCreateUserTicket(selectedUsers);
    setShowCreateForm(false);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl transition-colors">
      {/* Thanh hành động */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Danh sách nhân viên
        </h2>
        <button
          onClick={openCreateForm}
          className={`px-4 py-2 rounded-lg text-white ${
            selectedUsers.length > 0
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={selectedUsers.length === 0}
        >
          Gửi yêu cầu tạo tài khoản
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700 text-left">
            <th className="p-3 text-center">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked)
                    setSelectedUsers(
                      employees.filter((emp) => !emp.user).map((emp) => emp.id)
                    );
                  else setSelectedUsers([]);
                }}
                checked={
                  selectedUsers.length > 0 &&
                  selectedUsers.length ===
                    employees.filter((e) => !e.user).length
                }
              />
            </th>
            <th className="p-3">Ảnh</th>
            <th className="p-3">Họ và tên</th>
            <th className="p-3">Phòng ban</th>
            <th className="p-3">Role</th>
            <th className="p-3">Email</th>
            <th className="p-3">SĐT</th>
            <th className="p-3 text-center">Trạng thái</th>
            <th className="p-3 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr
              key={emp.id}
              className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition"
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
                <img
                  src={emp.avatarUrl || defaultAvatar}
                  alt={emp.fullName}
                  className="h-12 w-12 rounded-full object-cover border"
                />
              </td>
              <td className="p-3 font-medium">{emp.fullName}</td>
              <td className="p-3">{emp.departmentName}</td>
              <td className="p-3">{emp.user?.roleName || "-"}</td>
              <td className="p-3">{emp.personalEmail}</td>
              <td className="p-3">{emp.phone}</td>
              <td className="p-3 text-center">
                {emp.user ? (
                  <StatCard
                    label={emp.user.active ? "Active" : "Inactive"}
                    colors={{
                      Active: "bg-green-100 text-green-600",
                      Inactive: "bg-red-100 text-red-600",
                    }}
                  />
                ) : (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm">
                    Chưa có tài khoản
                  </span>
                )}
              </td>
              <td className="p-3 text-center">
                <button
                  type="button"
                  onClick={() => setSelected(emp)}
                  className={`flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-md
      bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50 transition`}
                >
                  <EyeIcon className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination setPage={setPage} totalPages={totalPages} page={page} />

      {/* Modal chi tiết */}
      <EmployeeDetailModal selected={selected} setSelected={setSelected} />
      {/* Modal tạo tài khoản */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-[500px] shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-green-600">
              Gửi yêu cầu tạo tài khoản
            </h3>

            <p className="mb-3 text-sm text-gray-500">
              Sẽ gửi yêu cầu tạo tài khoản cho {selectedUsers.length} nhân viên:
            </p>
            <ul className="list-disc ml-6 mb-4 text-sm">
              {employees
                .filter((e) => selectedUsers.includes(e.id))
                .map((e) => (
                  <li key={e.id}>{e.fullName}</li>
                ))}
            </ul>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Hủy
              </button>
              <button
                onClick={handleSendRequest}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Gửi yêu cầu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
