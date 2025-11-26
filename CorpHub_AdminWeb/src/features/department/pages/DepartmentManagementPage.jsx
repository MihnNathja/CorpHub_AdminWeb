import React, { useState } from "react";
import DepartmentTreeView from "../components/DepartmentTreeView";
import DepartmentOrgChart from "../components/DepartmentOrgChart";
import { useDepartmentManagement } from "../hooks/useDepartmentManagement";
import {
  Network,
  TreePine,
  PlusCircle,
  Pencil,
  Trash2,
  Loader2,
  RefreshCcw,
  ListTree,
} from "lucide-react";
import ConfirmDialog from "../../global/components/ConfirmDialog";
import DepartmentTreePage from "../components/DepartmentTreePage";
import PositionManagementPanel from "../components/PositionManagementPanel";

const DepartmentManagementPage = () => {
  const [viewMode, setViewMode] = useState("tree"); // "tree" | "org"
  const [form, setForm] = useState({ id: null, name: "", description: "" });
  const [isEditing, setIsEditing] = useState(false);

  const {
    departments,
    loading,
    handleCreate,
    handleUpdate,
    handleDelete,
    reload,
    handleAssignManager,
    handleMove,
  } = useDepartmentManagement();

  // 🧾 Xử lý form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Tên phòng ban không được để trống");

    try {
      if (isEditing) {
        await handleUpdate(form.id, form);
      } else {
        await handleCreate(form);
      }
      setForm({ id: null, name: "", description: "" });
      setIsEditing(false);
    } catch (err) {
      alert("Thao tác thất bại: " + err);
    }
  };

  const handleEdit = (dept) => {
    setForm({ id: dept.id, name: dept.name, description: dept.description });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setForm({ id: null, name: "", description: "" });
    setIsEditing(false);
  };

  const handleRemove = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa phòng ban này không?")) {
      await handleDelete(id);
    }
  };

  console.log(departments);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Quản lý Phòng ban
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Xem, chỉnh sửa và sắp xếp cấu trúc tổ chức của công ty
          </p>
        </div>

        {/* Nút đổi chế độ + reload */}
        <div className="flex gap-2">
          <button
            onClick={reload}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            <RefreshCcw size={16} />
          </button>

          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              viewMode === "tree"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            }`}
            onClick={() => setViewMode("tree")}
          >
            <TreePine size={16} />
            Dạng cây
          </button>

          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              viewMode === "org"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            }`}
            onClick={() => setViewMode("org")}
          >
            <Network size={16} />
            Sơ đồ tổ chức
          </button>

          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              viewMode === "position"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            }`}
            onClick={() => setViewMode("position")}
          >
            <ListTree size={16} />
            Chức danh
          </button>
        </div>
      </div>

      {/* Form thêm / sửa */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow mb-6 flex flex-col md:flex-row gap-3 border border-gray-200 dark:border-gray-700"
      >
        <input
          type="text"
          placeholder="Tên phòng ban"
          className="flex-1 border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Mô tả"
          className="flex-1 border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            disabled={loading}
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
              onClick={handleCancelEdit}
              className="px-4 py-2 rounded-lg border text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      {/* Danh sách hiển thị */}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={24} className="animate-spin text-gray-500" />
          </div>
        ) : viewMode === "tree" ? (
          // <DepartmentTreeView
          //   data={departments}
          //   onEdit={handleEdit}
          //   onDelete={handleRemove}
          // />
          <DepartmentTreePage
            departments={departments}
            onEditDepartment={handleUpdate}
            onDeleteDepartment={handleDelete}
            onAddChildDepartment={(parent) => console.log("Add child", parent)}
            onAssignManager={handleAssignManager}
            onMoveDepartment={handleMove}
          />
        ) : viewMode === "org" ? (
          <DepartmentOrgChart
            data={departments}
            onEdit={handleEdit}
            onDelete={handleRemove}
          />
        ) : (
          <PositionManagementPanel departments={departments} />
        )}
      </div>
    </div>
  );
};

export default DepartmentManagementPage;
