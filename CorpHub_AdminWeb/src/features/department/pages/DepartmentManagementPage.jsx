import React, { useState } from "react";
import DepartmentOrgChart from "../components/DepartmentOrgChart";
import { useDepartmentManagement } from "../hooks/useDepartmentManagement";
import {
  Network,
  TreePine,
  PlusCircle,
  Pencil,
  Loader2,
  RefreshCcw,
  ListTree,
} from "lucide-react";
import DepartmentTreePage from "../components/DepartmentTreePage";
import PositionManagementPanel from "../components/PositionManagementPanel";
import { showError } from "../../../utils/toastUtils";
import ConfirmDialog from "../../global/components/ConfirmDialog";

const DepartmentManagementPage = () => {
  const [viewMode, setViewMode] = useState("tree"); // "tree" | "org" | "position"
  const [form, setForm] = useState({ id: null, name: "", description: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [confirmState, setConfirmState] = useState({
    open: false,
    targetId: null,
  });

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

  const getErrorMessage = (err, fallback) =>
    typeof err === "string"
      ? err
      : err?.data?.message || err?.message || fallback;

  // Handle create/update form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showError("Department name is required");
      return;
    }

    try {
      if (isEditing) {
        await handleUpdate(form.id, form);
      } else {
        await handleCreate(form);
      }
      setForm({ id: null, name: "", description: "" });
      setIsEditing(false);
    } catch (err) {
      const message = getErrorMessage(err, "Action failed. Please try again.");
      showError(message);
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

  const handleRemove = (id) => {
    setConfirmState({ open: true, targetId: id });
  };

  const handleDeleteWithFeedback = async (id) => {
    try {
      await handleDelete(id);
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Delete department failed. Please try again."
      );
      showError(message);
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmState.targetId) return;
    await handleDeleteWithFeedback(confirmState.targetId);
    setConfirmState({ open: false, targetId: null });
  };

  const handleCancelDelete = () => {
    setConfirmState({ open: false, targetId: null });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl p-6 shadow-lg border border-white/10 mb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-sm">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-white/80 uppercase tracking-wide">
                Management
              </p>
              <h1 className="text-3xl font-bold">Department Management</h1>
              <p className="text-sm text-white/70 mt-1">
                View, edit, and organize your company structure
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={reload}
              title="Refresh"
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/15 text-white hover:bg-white/25 transition border border-white/20"
            >
              <RefreshCcw size={16} />
            </button>

            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                viewMode === "tree"
                  ? "bg-white text-blue-700 shadow-md"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              onClick={() => setViewMode("tree")}
            >
              <TreePine size={16} />
              Tree View
            </button>

            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                viewMode === "org"
                  ? "bg-white text-blue-700 shadow-md"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              onClick={() => setViewMode("org")}
            >
              <Network size={16} />
              Org Chart
            </button>

            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                viewMode === "position"
                  ? "bg-white text-blue-700 shadow-md"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              onClick={() => setViewMode("position")}
            >
              <ListTree size={16} />
              Positions
            </button>
          </div>
        </div>
      </div>

      {/* Create / Edit form — only for structure views */}
      {viewMode !== "position" && (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow mb-6 flex flex-col md:flex-row gap-3 border border-gray-200 dark:border-gray-700"
        >
          <input
            type="text"
            placeholder="Department name"
            className="flex-1 border rounded-lg px-3 py-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
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
              {isEditing ? "Update" : "Add new"}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 rounded-lg border text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

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
            onEditDepartment={handleEdit}
            onDeleteDepartment={handleRemove}
            onAddChildDepartment={(parent) => console.log("Add child", parent)}
            onAssignManager={handleAssignManager}
            onMoveDepartment={handleMove}
          />
        ) : viewMode === "org" ? (
          <DepartmentOrgChart
            data={departments}
            onEdit={handleEdit}
            onDelete={handleRemove}
            onAssignManager={handleAssignManager}
            onMoveDepartment={handleMove}
          />
        ) : (
          <PositionManagementPanel departments={departments} />
        )}
      </div>

      <ConfirmDialog
        open={confirmState.open}
        title="Xóa phòng ban"
        message="Bạn có chắc chắn muốn xóa phòng ban này? Hành động này không thể hoàn tác."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default DepartmentManagementPage;
