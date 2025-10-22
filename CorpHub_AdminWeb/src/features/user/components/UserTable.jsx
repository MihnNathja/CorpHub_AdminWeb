import { useEffect, useState } from "react";
import { Eye, Search, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import Pagination from "../../global/components/Pagination";
import defaultAvatar from "../../../assets/defaultAvatar.jpg";

const UserTable = ({
  users = [],
  totalPages = 1,
  loading,
  error,
  onSelectUser,
  onFetch,
  departments = [],
}) => {
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

          {/* 🟩 Trạng thái
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
            <option value="">Tất cả trạng thái</option>
            <option value="true">Đang hoạt động</option>
            <option value="false">Ngừng hoạt động</option>
          </select> */}
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
              <th
                className="p-2 border cursor-pointer select-none"
                onClick={() => handleSort("department")}
              >
                Phòng ban {renderSortIcon("department")}
              </th>
              {/* <th
                className="p-2 border cursor-pointer select-none"
                onClick={() => handleSort("active")}
              >
                Trạng thái {renderSortIcon("active")}
              </th> */}
              <th className="p-2 border text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="9" className="text-center text-red-500 p-4">
                  Error: {error}
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((u, i) => (
                <tr
                  key={u.id || i}
                  className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <td className="p-2 border text-center">
                    {i + 1 + page * 10}
                  </td>
                  <td className="p-2 border">
                    <img
                      src={u.avatar || defaultAvatar}
                      alt={u.fullName}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                  </td>
                  <td className="p-2 border font-medium">{u.fullName}</td>
                  <td className="p-2 border">{u.email}</td>
                  <td className="p-2 border">{u.phone || "-"}</td>
                  <td className="p-2 border">{u.gender || "-"}</td>
                  <td className="p-2 border">{u.department?.name || "-"}</td>
                  {/* <td className="p-2 border">
                    {u.active ? (
                      <span className="text-green-600 font-medium">
                        Hoạt động
                      </span>
                    ) : (
                      <span className="text-gray-500">Ngừng</span>
                    )}
                  </td> */}
                  <td className="p-2 border text-center">
                    <button
                      type="button"
                      onClick={() => onSelectUser(u.id)}
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md
                                 border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
                    >
                      <Eye className="h-4 w-4" /> View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
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
