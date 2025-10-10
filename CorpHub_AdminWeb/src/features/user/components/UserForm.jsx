import { useEffect } from "react";
import { useUserForm } from "../hooks/useUserForm";
import { useDispatch, useSelector } from "react-redux";
import { fetchTickets } from "../../ticket/store/ticketSlice";

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

// 🧩 Hàm tạo email công ty
const generateCompanyEmail = (fullName = "", domain = "company.com") => {
  if (!fullName) return "";
  const parts = removeVietnameseTones(fullName.trim().toLowerCase()).split(" ");
  const first = parts[parts.length - 1]; // tên
  const last = parts[0]; // họ
  return `${first}.${last}@${domain}`;
};

const UserForm = ({ onSubmit, user, ticketId }) => {
  const dispatch = useDispatch();
  const { form, setForm, handleChange, handleSubmit, departments, roles } =
    useUserForm(true, user, onSubmit);

  const { selectedTicket } = useSelector((state) => state.tickets);

  // ✅ Load ticket khi có ticketId
  useEffect(() => {
    if (ticketId) dispatch(fetchTickets({ ticketId }));
  }, [dispatch, ticketId]);

  // ✅ Khi ticket đã load → fill form
  useEffect(() => {
    if (!selectedTicket || !selectedTicket.meta) return;

    try {
      console.log(selectedTicket.meta);
      const meta = JSON.parse(selectedTicket.meta);
      const emp = Array.isArray(meta) ? meta[0] : meta;

      const autoEmail = generateCompanyEmail(emp.fullName, "company.com");
      const autoPassword = generateRandomPassword(emp.fullName);

      setForm((prev) => ({
        ...prev,
        employeeId: emp.employeeProfileId || "",
        email: autoEmail || "",
        password: autoPassword,
      }));
    } catch (err) {
      console.error("Không thể parse meta:", err);
    }
  }, [selectedTicket, setForm]);

  const inputClass =
    "w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-300 transition-colors";

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-gray-900 dark:text-gray-100 transition-colors">
      <h2 className="text-xl font-bold mb-4">
        {user ? "Chỉnh sửa tài khoản" : "Thêm tài khoản mới"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email công ty */}
        <div>
          <label className="block mb-1 font-medium">Email công ty</label>
          <input
            type="email"
            name="email"
            placeholder="Nhập email công ty"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Gợi ý: email tự tạo theo mẫu tên nhân viên.
          </p>
        </div>

        {/* Role */}
        <div>
          <label className="block mb-1 font-medium">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">Chọn role</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Mật khẩu tự sinh */}
        {!user && (
          <div>
            <label className="block mb-1 font-medium">Mật khẩu mặc định</label>
            <input
              type="text"
              name="password"
              placeholder="Mật khẩu sẽ được tự sinh"
              value={form.password}
              onChange={handleChange}
              className={inputClass}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Mật khẩu tự sinh, có thể chỉnh sửa nếu cần.
            </p>
          </div>
        )}

        <div className="text-right">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded"
          >
            {user ? "Cập nhật" : "Tạo tài khoản"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
