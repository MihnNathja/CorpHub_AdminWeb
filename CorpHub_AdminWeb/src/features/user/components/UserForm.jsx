import { useEffect, useMemo, useState } from "react";
import { Info } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTickets } from "../../ticket/store/ticketSlice";
import useRoles from "../hooks/useRoles";

// 🧩 Hàm tiện ích: bỏ dấu tiếng Việt
const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

// 🧩 Hàm sinh mật khẩu ngẫu nhiên
const generateRandomPassword = (fullName = "") => {
  const cleanName = removeVietnameseTones(fullName).split(" ")[0] || "User";
  const year = new Date().getFullYear();
  const random = Math.floor(100 + Math.random() * 900); // 3 chữ số ngẫu nhiên
  return `${cleanName}@${year}${random}`;
};

// 🧩 Hàm tạo email công ty từ mã nhân viên
const generateCompanyEmail = (empCode = "", domain = "company.com") => {
  if (!empCode) return "";
  return `${empCode}@${domain}`;
};

const UserForm = ({ onSubmit, ticketId }) => {
  const dispatch = useDispatch();
  const { roles, rolesLoading, rolesError, reloadRoles } = useRoles();

  const { selectedTicket } = useSelector((state) => state.tickets);
  const [userRows, setUserRows] = useState([
    { email: "", role: "", password: "", employeeId: "", fullName: "" },
  ]);
  const [prefilled, setPrefilled] = useState(false);
  const [rowErrors, setRowErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Load ticket khi có ticketId (không phụ thuộc chế độ)
  useEffect(() => {
    if (ticketId) {
      dispatch(fetchTickets({ ticketId }));
    }
    // Cho phép fill lại khi ticket thay đổi
    setPrefilled(false);
  }, [dispatch, ticketId]);

  // ✅ Khi ticket đã load → trích xuất meta rồi gán vào form/rows
  useEffect(() => {
    if (!selectedTicket || !selectedTicket.meta || prefilled) return;

    try {
      const meta = JSON.parse(selectedTicket.meta);
      const employees = Array.isArray(meta) ? meta : [meta];

      // Bản đồ nhân viên → dòng nhập liệu
      const mappedRows = employees.map((emp) => ({
        email: generateCompanyEmail(emp.code, "company.com"),
        role: "",
        password: generateRandomPassword(emp.fullName),
        employeeId: emp.employeeProfileId || "",
        fullName: emp.fullName || "",
      }));

      if (mappedRows.length > 0) {
        setUserRows(mappedRows);
        setRowErrors(new Array(mappedRows.length).fill({}));
        setPrefilled(true);
      }
    } catch (err) {
      console.error("Cannot parse meta:", err);
    }
  }, [selectedTicket, prefilled]);

  const inputClass =
    "w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 transition-colors shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);

  const validateRows = (list) => {
    const errs = list.map((u) => {
      const e = {};
      if (!u.email.trim()) e.email = "Email is required";
      else if (!emailRegex.test(u.email)) e.email = "Invalid email";
      if (!u.role) e.role = "Select role";
      if (!u.password.trim()) e.password = "Enter password";
      return e;
    });
    const hasErr = errs.some((e) => Object.keys(e).length > 0);
    return { errs, hasErr };
  };

  const handleRowChange = (index, field, value) => {
    setUserRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleRowsSubmit = async (e) => {
    e.preventDefault();
    const { errs, hasErr } = validateRows(userRows);
    setRowErrors(errs);
    if (hasErr) return;

    setIsLoading(true);
    try {
      for (const entry of userRows) {
        await Promise.resolve(onSubmit(entry));
      }
      // Clear fields sau khi tạo xong tất cả tài khoản
      setUserRows([
        {
          email: "",
          role: "",
          password: "",
          employeeId: "",
          fullName: "",
        },
      ]);
      setRowErrors([]);
      setPrefilled(true);
    } catch (err) {
      console.error("Failed to create account:", err);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(userRows);
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg text-gray-900 dark:text-gray-100 transition-colors space-y-4 border border-gray-100 dark:border-gray-700">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.18em] text-blue-600 font-semibold">
            Create Account
          </p>
          <h2 className="text-xl font-bold leading-tight">Add New</h2>
          {ticketId && (
            <p className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 mt-1">
              Ticket: {ticketId}
            </p>
          )}
        </div>
      </div>

      <form onSubmit={handleRowsSubmit} className="space-y-4">
        {userRows.map((u, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/80 dark:to-gray-800 shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">Account #{idx + 1}</p>
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 border border-gray-200 dark:border-gray-600">
                    Company Email
                  </span>
                  {u.fullName && <span>{u.fullName}</span>}
                </p>
              </div>
              {userRows.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setUserRows((prev) => prev.filter((_, i) => i !== idx))
                  }
                  disabled={isLoading}
                  className="text-xs text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="flex items-center gap-1 mb-1 font-medium">
                  <span>Company Email</span>
                  <span
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
                    title="Generated from employee code; edit if needed"
                  >
                    <Info className="w-4 h-4" />
                  </span>
                </label>
                <input
                  type="email"
                  value={u.email}
                  onChange={(e) =>
                    handleRowChange(idx, "email", e.target.value)
                  }
                  disabled={isLoading}
                  className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="email@company.com"
                  required
                />
                {rowErrors[idx]?.email && (
                  <p className="text-xs text-red-600 mt-1">
                    {rowErrors[idx].email}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1 font-medium">Role</label>
                <select
                  value={u.role}
                  onChange={(e) => handleRowChange(idx, "role", e.target.value)}
                  disabled={isLoading}
                  className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                  required
                >
                  <option value="">Select role</option>
                  {rolesLoading && <option disabled>Loading roles...</option>}
                  {!rolesLoading && rolesError && (
                    <option disabled>Failed to load roles</option>
                  )}
                  {!rolesLoading && !rolesError && roles.length === 0 && (
                    <option disabled>No roles available</option>
                  )}
                  {roles.map((r) => (
                    <option key={r.id || r.name} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
                {rowErrors[idx]?.role && (
                  <p className="text-xs text-red-600 mt-1">
                    {rowErrors[idx].role}
                  </p>
                )}
                {rolesError && (
                  <div className="text-xs text-amber-600 mt-1 flex items-center gap-2">
                    <span>Failed to load role list.</span>
                    <button
                      type="button"
                      onClick={reloadRoles}
                      className="underline font-semibold"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1 mb-1 font-medium">
                <span>Default Password</span>
                <span
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
                  title="Randomly generated from name; editable"
                >
                  <Info className="w-4 h-4" />
                </span>
              </label>
              <input
                type="text"
                value={u.password}
                onChange={(e) =>
                  handleRowChange(idx, "password", e.target.value)
                }
                disabled={isLoading}
                className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                placeholder="Optional password"
                required
              />
              {rowErrors[idx]?.password && (
                <p className="text-xs text-red-600 mt-1">
                  {rowErrors[idx].password}
                </p>
              )}
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              setUserRows((prev) => [
                ...prev,
                {
                  email: "",
                  role: "",
                  password: "",
                  employeeId: "",
                  fullName: "",
                },
              ])
            }
            disabled={isLoading}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-semibold text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Add Row
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition font-semibold disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {isLoading ? "Creating..." : "Create All"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
