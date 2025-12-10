import { useEffect, useState } from "react";
import {
  Eye,
  Search,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  NotebookPen,
  Trash2,
  KeyRound,
  Unlock,
  Lock,
  Loader2,
  UserRound,
} from "lucide-react";
import Pagination from "../../global/components/Pagination";
import defaultAvatar from "../../../assets/defaultAvatar.jpg";
import { Tooltip } from "react-tooltip";
import { useDepartment } from "../../department/hooks/useDepartment";
import { useUser } from "../hooks/useUser";
import { useSelector } from "react-redux";
import ConfirmDialog from "../../global/components/ConfirmDialog";

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

  const { toggleActive, handleResetPassword } = useUser();
  const { departments } = useDepartment();

  const [loadingId, setLoadingId] = useState(null);
  const [confirmData, setConfirmData] = useState({
    open: false,
    userId: null,
    isActive: false,
  });
  const [bulkConfirm, setBulkConfirm] = useState({ open: false, type: null });
  const [selectedIds, setSelectedIds] = useState([]);

  const onResetPassword = async (userId) => {
    setLoadingId(userId);
    try {
      await handleResetPassword(userId);
    } finally {
      setLoadingId(null);
    }
  };

  const { list, meta, loading, error } = useSelector((state) => state.user);

  // 🧩 Dữ liệu giả cho demo
  const mockUsers = list.map((u, index) => ({
    ...u,
    // Nếu backend chưa có role/active thì gán tạm
    role: u.role || (index % 2 === 0 ? "Admin" : "Nhân viên"),
    active: u.active ?? index % 3 !== 0,
  }));

  const handleToggleActive = (userId, isActive) => {
    setConfirmData({ open: true, userId, isActive });
  };

  const handleConfirmToggle = () => {
    if (confirmData.userId) {
      toggleActive(confirmData.userId);
    }
    setConfirmData({ open: false, userId: null, isActive: false });
  };

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(mockUsers.map((u) => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectOne = (userId) => {
    setSelectedIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
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

        {/* Filters as pill toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200">
            <span>Giới tính</span>
            {["", "male", "female"].map((g) => (
              <button
                key={g || "all"}
                onClick={() => {
                  setPage(0);
                  setFilters((f) => ({ ...f, gender: g }));
                }}
                className={`px-3 py-1 rounded-full transition ${
                  filters.gender === g
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-blue-600"
                }`}
              >
                {g === "male" ? "Nam" : g === "female" ? "Nữ" : "Tất cả"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200">
            <span>Trạng thái</span>
            {["", "true", "false"].map((v) => (
              <button
                key={v || "all"}
                onClick={() => {
                  setPage(0);
                  setFilters((f) => ({ ...f, active: v }));
                }}
                className={`px-3 py-1 rounded-full transition ${
                  filters.active === v
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-blue-600"
                }`}
              >
                {v === "true"
                  ? "Active"
                  : v === "false"
                  ? "Inactive"
                  : "Tất cả"}
              </button>
            ))}
          </div>

          <select
            value={filters.departmentId}
            onChange={(e) =>
              setFilters((f) => ({ ...f, departmentId: e.target.value }))
            }
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Tất cả phòng ban</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 shadow-sm">
          <div className="text-sm font-semibold text-blue-800">
            Đã chọn {selectedIds.length} người dùng
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBulkConfirm({ open: true, type: "lock" })}
              className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-sm font-semibold"
            >
              Khóa
            </button>
            <button
              onClick={() => setBulkConfirm({ open: true, type: "unlock" })}
              className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-sm font-semibold"
            >
              Mở khóa
            </button>
            <button
              onClick={() => setBulkConfirm({ open: true, type: "reset" })}
              className="px-3 py-1.5 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 text-sm font-semibold"
            >
              Đặt lại mật khẩu
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-sm"
            >
              Bỏ chọn
            </button>
          </div>
        </div>
      )}

      {/* 🧾 Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-left">
              <th className="p-2 border text-center w-10">
                <input
                  type="checkbox"
                  checked={
                    selectedIds.length === mockUsers.length &&
                    mockUsers.length > 0
                  }
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                />
              </th>
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
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(u.id)}
                      onChange={() => toggleSelectOne(u.id)}
                    />
                  </td>
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
                  <td className="p-2 border">
                    {u.active ? (
                      <span className="text-green-600 font-medium">Active</span>
                    ) : (
                      <span className="text-gray-500">Inactive</span>
                    )}
                  </td>
                  <td className="p-2 border text-center">
                    <div className="flex justify-center gap-2">
                      {/* View + Edit combined */}
                      <button
                        data-tooltip-id={`detail-tip-${u.id}`}
                        data-tooltip-content="Xem / Chỉnh sửa"
                        onClick={() => onSelectUser(u.id)}
                        className="p-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600"
                      >
                        <NotebookPen className="w-4 h-4" />
                      </button>
                      <Tooltip id={`detail-tip-${u.id}`} place="top" />

                      {/* Reset password */}
                      <button
                        data-tooltip-id={`reset-tip-${u.id}`}
                        data-tooltip-content="Đặt lại mật khẩu"
                        onClick={() => onResetPassword(u.id)}
                        disabled={loadingId === u.id}
                        className="p-1.5 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-600"
                      >
                        {loadingId === u.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          </>
                        ) : (
                          <>
                            <KeyRound className="w-4 h-4 mr-2" />
                          </>
                        )}
                      </button>
                      <Tooltip id={`reset-tip-${u.id}`} place="top" />

                      {/* Lock / Unlock */}
                      <button
                        data-tooltip-id={`lock-tip-${u.id}`}
                        data-tooltip-content={
                          u.active ? "Khóa tài khoản" : "Mở khóa tài khoản"
                        }
                        onClick={() => {
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
                  <div className="flex flex-col items-center gap-2 text-slate-500">
                    <UserRound className="w-6 h-6" />
                    <p className="font-semibold">Không tìm thấy người dùng</p>
                    <p className="text-xs text-slate-400">
                      Hãy thử thay đổi bộ lọc hoặc tìm kiếm.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} setPage={setPage} totalPages={meta.totalPages} />

      <ConfirmDialog
        open={confirmData.open}
        title={confirmData.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
        message={
          confirmData.isActive
            ? "Bạn có chắc chắn muốn khóa tài khoản này?"
            : "Bạn có chắc chắn muốn mở khóa tài khoản này?"
        }
        onConfirm={handleConfirmToggle}
        onCancel={() =>
          setConfirmData({ open: false, userId: null, isActive: false })
        }
      />

      <ConfirmDialog
        open={bulkConfirm.open}
        title={
          bulkConfirm.type === "lock"
            ? "Khóa tài khoản"
            : bulkConfirm.type === "unlock"
            ? "Mở khóa tài khoản"
            : "Đặt lại mật khẩu"
        }
        message={`Thực hiện hành động cho ${selectedIds.length} người dùng đã chọn?`}
        onConfirm={async () => {
          if (bulkConfirm.type === "reset") {
            for (const id of selectedIds) {
              await onResetPassword(id);
            }
          } else {
            for (const id of selectedIds) {
              await toggleActive(id);
            }
          }
          setBulkConfirm({ open: false, type: null });
          setSelectedIds([]);
        }}
        onCancel={() => setBulkConfirm({ open: false, type: null })}
      />
    </div>
  );
};

export default UserTable;
