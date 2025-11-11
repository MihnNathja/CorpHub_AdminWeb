// src/features/parameters/components/ParameterConfigPage.jsx
import { Plus, Trash2, Settings2 } from "lucide-react";
import { useState } from "react";
import { useParameter } from "../hooks/useParameter";

const PARAMETER_GROUPS = [
  { code: "COMPETENCY_TYPE", label: "Loại năng lực" },
  { code: "COMPETENCY_LEVEL", label: "Cấp độ năng lực" },
  { code: "DOCUMENT_TYPE", label: "Loại tài liệu" },
];

export default function ParameterConfigPage() {
  const { grouped, loading, error, reload } = useParameter();
  const [form, setForm] = useState({ group: "", code: "", name: "" });
  const [localError, setLocalError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");
    if (!form.group) return setLocalError("Vui lòng chọn nhóm tham số");
    if (!form.code.trim()) return setLocalError("Mã không được để trống");
    if (!form.name.trim()) return setLocalError("Tên không được để trống");

    alert(`(Demo) Thêm mới ${form.name} - nhóm ${form.group}`);
    setForm({ group: "", code: "", name: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Settings2 size={20} className="text-gray-600" />
        <h2 className="text-lg font-semibold">Cấu hình tham số hệ thống</h2>
        <button
          onClick={reload}
          className="ml-auto bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition"
        >
          Tải lại
        </button>
      </div>

      {loading && (
        <p className="text-sm text-gray-500 italic">
          Đang tải dữ liệu từ máy chủ...
        </p>
      )}
      {error && (
        <p className="text-sm text-red-500">
          Lỗi tải dữ liệu: {JSON.stringify(error)}
        </p>
      )}

      {/* Form thêm mới */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border rounded-xl bg-gray-50 shadow-sm space-y-3"
      >
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nhóm tham số
            </label>
            <select
              value={form.group}
              onChange={(e) => setForm({ ...form, group: e.target.value })}
              className="border p-2 rounded w-56 focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="">-- Chọn nhóm --</option>
              {PARAMETER_GROUPS.map((g) => (
                <option key={g.code} value={g.code}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mã</label>
            <input
              value={form.code}
              onChange={(e) =>
                setForm({ ...form, code: e.target.value.toUpperCase() })
              }
              className="border p-2 rounded w-36 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Tên hiển thị
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border p-2 rounded w-56 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <Plus size={16} /> Thêm
          </button>
        </div>

        {localError && (
          <p className="text-red-600 text-sm mt-2">{localError}</p>
        )}
      </form>

      {/* Danh sách tham số */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([group, list]) => {
          const groupLabel =
            PARAMETER_GROUPS.find((g) => g.code === group)?.label || group;

          return (
            <div key={group} className="border rounded-lg shadow-sm">
              <div className="bg-gray-100 px-4 py-2 font-semibold text-gray-700 border-b">
                {groupLabel} ({group})
              </div>

              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border p-2 w-40 text-left">Mã</th>
                    <th className="border p-2 text-left">Tên hiển thị</th>
                    <th className="border p-2 w-20 text-center">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition">
                      <td className="border p-2">{p.code}</td>
                      <td className="border p-2">{p.name}</td>
                      <td className="border p-2 text-center">
                        <button
                          className="text-red-600 hover:text-red-800"
                          title="Xóa"
                          onClick={() => alert(`(Demo) Xóa tham số ${p.name}`)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}
