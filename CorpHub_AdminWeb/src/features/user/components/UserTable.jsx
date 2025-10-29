import { useEffect, useState } from "react";
import {
  Eye,
  Search,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Pencil,
  Trash2,
  KeyRound,
  Unlock,
  Lock,
} from "lucide-react";
import Pagination from "../../global/components/Pagination";
import defaultAvatar from "../../../assets/defaultAvatar.jpg";
import { Tooltip } from "react-tooltip";
import { useDepartment } from "../../department/hooks/useDepartment";
import { useUser } from "../hooks/useUser";
import { useSelector } from "react-redux";

const UserTable = ({ onSelectUser, onFetch }) => {
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [filters, setFilters] = useState({
    gender: "",
    departmentId: "",
    active: "",
  });
  const [sort, setSort] = useState({
    field: "fullName",
    direction: "asc",
  });

  const { toggleActive } = useUser();
  const { departments } = useDepartment();

  const { list, totalPages, loading, error } = useSelector(
    (state) => state.user
  );

  // 🧩 Dữ liệu giả cho demo
  const mockUsers = list.map((u, index) => ({
    ...u,
    // Nếu backend chưa có role/active thì gán tạm
    role: u.role || (index % 2 === 0 ? "Admin" : "Nhân viên"),
    active: u.active ?? index % 3 !== 0,
  }));

  const handleToggleActive = (userId, isActive) => {
    if (confirm(`${isActive ? "Khóa" : "Mở khóa"} tài khoản này?`)) {
      // Gọi API backend hoặc service đổi trạng thái
      toggleActive(userId);
    }
  };

  useEffect(() => {
    onFetch(page, keyword, filters, sort);
  }, [page, keyword, filters, sort]);

  const handleSort = (field) => {
    setSort((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const renderSortIcon = (field) => {
    if (sort.field !== field)
      return <ArrowUpDown className="inline w-4 h-4 text-gray-400" />;
    return sort.direction === "asc" ? (
      <ArrowUp className="inline w-4 h-4 text-blue-500" />
    ) : (
      <ArrowDown className="inline w-4 h-4 text-blue-500" />
    );
  };

  return (
    <div className="space-y-3">
      {/* 🔍 Search + Filters */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        {/* Search */}
        <div className="relative w-64">
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              setPage(0);
              setKeyword(e.target.value);
            }}
            placeholder="Search by Fullname, Email, Phone"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pl-9
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-2 top-2.5 text-gray-400 w-4 h-4" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={filters.gender}
            onChange={(e) =>
              setFilters((f) => ({ ...f, gender: e.target.value }))
            }
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <select
            value={filters.departmentId}
            onChange={(e) =>
              setFilters((f) => ({ ...f, departmentId: e.target.value }))
            }
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          {/* 🟩 Trạng thái */}
          <select
            value={filters.active}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                active: e.target.value,
              }))
            }
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {/* 🧾 Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-left">
              <th className="p-2 border text-center w-10">#</th>
              <th className="p-2 border">Avatar</th>
              <th
                className="p-2 border cursor-pointer select-none"
                onClick={() => handleSort("fullName")}
              >
                Fullname {renderSortIcon("fullName")}
              </th>
              <th
                className="p-2 border cursor-pointer select-none"
                onClick={() => handleSort("email")}
              >
                Email {renderSortIcon("email")}
              </th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Gender</th>
              <th className="p-2 border">Department</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="10" className="text-center text-red-500 p-4">
                  Error: {error}
                </td>
              </tr>
            ) : mockUsers.length > 0 ? (
              mockUsers.map((u, i) => (
                <tr
                  key={u.id || i}
                  className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <td className="p-2 border text-center">
                    {i + 1 + page * 10}
                  </td>
                  <td className="p-2 border text-center">
                    <img
                      src={u.avatar || defaultAvatar}
                      alt={u.fullName}
                      className="w-10 h-10 rounded-full object-cover border mx-auto"
                    />
                  </td>
                  <td className="p-2 border font-medium">{u.fullName}</td>
                  <td className="p-2 border">{u.email}</td>
                  <td className="p-2 border">{u.phone || "-"}</td>
                  <td className="p-2 border">{u.gender || "-"}</td>
                  <td className="p-2 border">{u.department?.name || "-"}</td>
                  <td className="p-2 border">{u.role}</td>
                  <td className="p-2 border">
                    {u.active ? (
                      <span className="text-green-600 font-medium">Active</span>
                    ) : (
                      <span className="text-gray-500">Inactive</span>
                    )}
                  </td>
                  <td className="p-2 border text-center">
                    <div className="flex justify-center gap-2">
                      {/* View */}
                      <button
                        data-tooltip-id={`view-tip-${u.id}`}
                        data-tooltip-content="Xem chi tiết"
                        onClick={() => onSelectUser(u.id)}
                        className="p-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <Tooltip id={`view-tip-${u.id}`} place="top" />

                      {/* Edit */}
                      <button
                        data-tooltip-id={`edit-tip-${u.id}`}
                        data-tooltip-content="Chỉnh sửa người dùng"
                        onClick={() => alert(`Edit ${u.fullName}`)}
                        className="p-1.5 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-600"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <Tooltip id={`edit-tip-${u.id}`} place="top" />

                      {/* Reset password */}
                      <button
                        data-tooltip-id={`reset-tip-${u.id}`}
                        data-tooltip-content="Đặt lại mật khẩu"
                        onClick={() =>
                          alert(`Reset password for ${u.fullName}`)
                        }
                        className="p-1.5 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-600"
                      >
                        <KeyRound className="w-4 h-4" />
                      </button>
                      <Tooltip id={`reset-tip-${u.id}`} place="top" />

                      {/* Lock / Unlock */}
                      <button
                        data-tooltip-id={`lock-tip-${u.id}`}
                        data-tooltip-content={
                          u.active ? "Khóa tài khoản" : "Mở khóa tài khoản"
                        }
                        onClick={() => {
                          console.log("Khóa/mở khóa");
                          handleToggleActive(u.id, u.active);
                        }}
                        className={`p-1.5 rounded-full transition-colors ${
                          u.active
                            ? "hover:bg-yellow-100 dark:hover:bg-yellow-900/30 text-yellow-600"
                            : "hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600"
                        }`}
                      >
                        {u.active ? (
                          <Lock className="w-4 h-4" />
                        ) : (
                          <Unlock className="w-4 h-4" />
                        )}
                      </button>
                      <Tooltip id={`lock-tip-${u.id}`} place="top" />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="10"
                  className="text-center p-4 text-gray-500 dark:text-gray-300"
                >
                  Không tìm thấy người dùng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
};

export default UserTable;
