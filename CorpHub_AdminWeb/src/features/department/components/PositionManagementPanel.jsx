// src/features/department/components/PositionManagementPanel.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Loader2,
  PlusCircle,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useDepartmentPositions } from "../hooks/useDepartmentPosition";

// flatten cây phòng ban thành list để cho vào dropdown
const flattenDepartments = (nodes) => {
  const res = [];
  const dfs = (list, prefix = "") => {
    list?.forEach((d) => {
      res.push({
        id: d.id,
        name: prefix ? `${prefix} / ${d.name}` : d.name,
      });
      if (d.children && d.children.length) {
        dfs(d.children, prefix ? `${prefix} / ${d.name}` : d.name);
      }
    });
  };
  dfs(nodes);
  return res;
};

const PositionManagementPanel = ({ departments }) => {
  const flatDepts = useMemo(
    () => flattenDepartments(departments || []),
    [departments]
  );

  const [selectedDeptId, setSelectedDeptId] = useState(
    flatDepts[0]?.id || null
  );

  useEffect(() => {
    if (!flatDepts.length) return;
    if (!selectedDeptId) {
      setSelectedDeptId(flatDepts[0].id);
    }
  }, [flatDepts, selectedDeptId]);

  const {
    positions,
    loading,
    error,
    add: handleCreate,
    update: handleUpdate,
    handleReorderLocal,
    handleReorderSave,
    load,
    remove: handleDelete,
    reorder,
  } = useDepartmentPositions(selectedDeptId);

  // form add/edit
  const [form, setForm] = useState({
    id: null,
    name: "",
    code: "",
    description: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const resetForm = () => {
    setForm({ id: null, name: "", code: "", description: "" });
    setIsEditing(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Tên chức danh không được để trống");
      return;
    }
    try {
      if (isEditing) {
        await handleUpdate(form.id, {
          name: form.name,
          code: form.code,
          description: form.description,
        });
      } else {
        await handleCreate({
          name: form.name,
          code: form.code,
          description: form.description,
        });
      }
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const onEditClick = (pos) => {
    setForm({
      id: pos.id,
      name: pos.name || "",
      code: pos.code || "",
      description: pos.description || "",
    });

    setIsEditing(true);
  };

  const onDeleteClick = async (pos) => {
    if (window.confirm(`Xóa chức danh "${pos.name}"?`)) {
      await handleDelete(pos.id);
    }
  };

  // reorder UI: move up/down (local)
  const movePosition = (index, direction) => {
    if (!positions || positions.length === 0) return;

    const cloned = [...positions];
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= cloned.length) return;

    // Swap
    [cloned[index], cloned[targetIndex]] = [cloned[targetIndex], cloned[index]];

    const orderedIds = cloned.map((p) => p.id);

    // cập nhật local FE (levelOrder)
    handleReorderLocal(orderedIds);
  };

  return (
    <div className="space-y-4">
      {/* Chọn phòng ban */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Quản lý chức danh
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Thêm, chỉnh sửa và sắp xếp chức danh theo từng phòng ban.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Phòng ban:
          </span>
          <select
            className="border rounded-lg px-3 py-2 text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white"
            value={selectedDeptId || ""}
            onChange={(e) => {
              setSelectedDeptId(e.target.value || null);
              resetForm();
            }}
          >
            {flatDepts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Form thêm / sửa */}
      <form
        onSubmit={onSubmit}
        className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col md:flex-row gap-3"
      >
        <input
          type="text"
          placeholder="Tên chức danh"
          className="flex-1 border rounded-lg px-3 py-2 text-sm dark:bg-gray-950 dark:border-gray-700 dark:text-white"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Mã chức danh (code)"
          className="flex-1 border rounded-lg px-3 py-2 text-sm dark:bg-gray-950 dark:border-gray-700 dark:text-white"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
        />

        <input
          type="text"
          placeholder="Mô tả (không bắt buộc)"
          className="flex-1 border rounded-lg px-3 py-2 text-sm dark:bg-gray-950 dark:border-gray-700 dark:text-white"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={loading || !selectedDeptId}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : isEditing ? (
              <Pencil size={16} />
            ) : (
              <PlusCircle size={16} />
            )}
            {isEditing ? "Cập nhật" : "Thêm mới"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-lg border text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      {/* Danh sách chức danh */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <div className="bg-gray-100 dark:bg-gray-900 px-4 py-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Danh sách chức danh
          </span>
          <button
            type="button"
            onClick={() => handleReorderSave(positions.map((p) => p.id))}
            disabled={loading || !positions?.length}
            className="text-xs px-3 py-1 rounded-lg border text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 disabled:opacity-50"
          >
            Lưu thứ tự
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 size={20} className="animate-spin text-gray-500" />
          </div>
        ) : !selectedDeptId ? (
          <div className="p-4 text-sm text-gray-500">
            Vui lòng chọn phòng ban để xem danh sách chức danh.
          </div>
        ) : !positions.length ? (
          <div className="p-4 text-sm text-gray-500">
            Chưa có chức danh nào cho phòng ban này.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
              {positions.map((pos, idx) => (
                <li
                  key={pos.id}
                  className="flex items-center justify-between px-4 py-4 transition-all hover:bg-gray-100 dark:hover:bg-gray-800/50"
                >
                  {/* LEFT SIDE */}
                  <div className="flex flex-col gap-1">
                    {/* TITLE + BADGES */}
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {pos.name}
                      </p>

                      {/* Level chip */}
                      <span className="px-2 py-[2px] text-xs rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        Level {pos.levelOrder}
                      </span>

                      {/* Lowest chip */}
                      {idx === 0 && (
                        <span className="px-2 py-[2px] text-xs rounded-md bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-300">
                          Thấp nhất • Mặc định
                        </span>
                      )}

                      {/* Highest chip */}
                      {idx === positions.length - 1 && positions.length > 1 && (
                        <span className="px-2 py-[2px] text-xs rounded-md bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                          Cao nhất
                        </span>
                      )}
                    </div>

                    {/* DESCRIPTION */}
                    {pos.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {pos.description}
                      </p>
                    )}
                  </div>

                  {/* RIGHT ACTIONS */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => movePosition(idx, -1)}
                      className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <ArrowUp size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => movePosition(idx, 1)}
                      className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <ArrowDown size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onEditClick(pos)}
                      className="p-1 rounded-md text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteClick(pos)}
                      className="p-1 rounded-md text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </ul>
        )}

        {error && (
          <div className="px-4 py-2 text-xs text-red-500 border-t border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40">
            {typeof error === "string" ? error : "Đã xảy ra lỗi."}
          </div>
        )}
      </div>
    </div>
  );
};

export default PositionManagementPanel;
