import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useDepartment } from "../../department/hooks/useDepartment";
import { priorityColors } from "../../global/const/priorityColors";
import { useCategory } from "../hooks/useCategory";
import { useAttachments } from "../hooks/useAttachment";
import TicketAttachments from "./TicketAttachments";
import ConfirmDialog from "../../global/components/ConfirmDialog";

const AddTicketModal = ({ ticket, isOpen, onClose, onSubmit }) => {
  const { items: attachments, download, remove } = useAttachments();

  const [formData, setFormData] = useState({
    title: "",
    departmentId: "",
    priority: "",
    categoryId: "",
    description: "",
    attachments: [], // thêm state cho file
  });

  const {
    departments,
    loading: loadingDept,
    error: errorDept,
  } = useDepartment();
  const { categories, loading: loadingCat, error: errorCat } = useCategory();
  const priorities = Object.keys(priorityColors);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (ticket) {
        setFormData({
          title: ticket.title || "",
          departmentId: ticket.department?.id || "",
          priority: ticket.priority || "",
          categoryId: ticket.category?.id || "",
          description: ticket.description || "",
          attachments: attachments,
        });
      } else {
        setFormData({
          title: "",
          departmentId: "",
          priority: "",
          categoryId: "",
          description: "",
          attachments: [],
        });
      }
    }
  }, [isOpen, ticket]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files], // thêm file mới
    }));
  };

  const handleRemoveFile = (index) => {
    const file = formData.attachments[index];
    if (!(file instanceof File) && file.id) {
      // mở confirm và lưu id để xoá
      setConfirmDeleteId(file.id);
    } else {
      // chỉ xoá trong state
      setFormData((prev) => {
        const updated = [...prev.attachments];
        updated.splice(index, 1);
        return { ...prev, attachments: updated };
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.departmentId ||
      !formData.priority ||
      !formData.categoryId
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    onSubmit({ ...formData, id: ticket?.id });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {ticket ? "Edit Ticket" : "Add New Ticket"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              placeholder="Enter ticket title"
              required
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            {loadingDept ? (
              <p className="text-gray-500 text-sm">Loading departments...</p>
            ) : errorDept ? (
              <p className="text-red-500 text-sm">{errorDept}</p>
            ) : (
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                required
              >
                <option value="">Select department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              required
            >
              <option value="">Select priority</option>
              {priorities.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            {loadingCat ? (
              <p className="text-gray-500 text-sm">Loading categories...</p>
            ) : errorCat ? (
              <p className="text-red-500 text-sm">{errorCat}</p>
            ) : (
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-lg p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              placeholder="Enter description"
            />
          </div>

          {/* Attachments */}
          <TicketAttachments
            attachments={formData.attachments}
            onDownload={download}
            onRemove={handleRemoveFile}
            onUpload={handleFileChange}
            ticket={ticket}
            mode={ticket ? "edit" : "add"}
          />

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
      <ConfirmDialog
        open={!!confirmDeleteId}
        onConfirm={() => {
          remove(confirmDeleteId); // gọi API xoá
          setFormData((prev) => ({
            ...prev,
            attachments: prev.attachments.filter(
              (f) => !(f instanceof File) && f.id !== confirmDeleteId
            ),
          }));
          setConfirmDeleteId(null);
        }}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
};

export default AddTicketModal;
