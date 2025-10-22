import { useEffect, useState } from "react";
import { Eye, Search } from "lucide-react";
import Pagination from "../../global/components/Pagination";
import defaultAvatar from "../../../assets/defaultAvatar.jpg";

const UserTable = ({
  users = [],
  totalPages = 1,
  loading,
  error,
  onSelectUser,
  onFetch,
}) => {
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    onFetch(page, keyword);
  }, [page, keyword]);

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              console.log("Trang hiện tại: ", page);
              setPage(0); // reset page khi tìm kiếm mới
              setKeyword(e.target.value);
            }}
            placeholder="Tìm kiếm theo tên, email..."
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pl-9
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-2 top-2.5 text-gray-400 w-4 h-4" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-left">
              <th className="p-2 border text-center w-10">#</th>
              <th className="p-2 border">Avatar</th>
              <th className="p-2 border">Full Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Gender</th>
              <th className="p-2 border">Department</th>
              <th className="p-2 border text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="8" className="text-center text-red-500 p-4">
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
                  colSpan="8"
                  className="text-center p-4 text-gray-500 dark:text-gray-300"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
};

export default UserTable;
