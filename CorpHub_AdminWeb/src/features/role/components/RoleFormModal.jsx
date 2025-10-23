import React, { useEffect, useState } from "react";

const RoleFormModal = ({ isOpen, onClose, onSave, role, allPermissions }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    permissions: [],
  });

  useEffect(() => {
    if (role) setForm(role);
    else setForm({ name: "", description: "", permissions: [] });
  }, [role]);

  const togglePermission = (perm) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  if (!isOpen) return null; // ẩn modal khi chưa mở

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-lg p-6 relative animate-fadeIn">
        {/* Nút đóng */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          {role ? "Chỉnh sửa vai trò" : "Thêm vai trò mới"}
        </h2>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Tên vai trò
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="VD: Quản trị viên"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Mô tả
            </label>
            <textarea
              rows="3"
              className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mô tả vai trò"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Quyền hạn
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-52 overflow-y-auto border p-2 rounded-lg dark:border-gray-700">
              {allPermissions.map((perm) => (
                <label
                  key={perm}
                  className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <input
                    type="checkbox"
                    checked={form.permissions.includes(perm)}
                    onChange={() => togglePermission(perm)}
                    className="accent-blue-600"
                  />
                  <span>{perm}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t dark:border-gray-700">
            <button
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={() => onSave(form)}
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleFormModal;
