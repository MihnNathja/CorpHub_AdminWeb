import React, { useState, useEffect } from "react";
import { X, Upload, Paperclip } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDepartment } from "../../department/hooks/useDepartment";
import { priorityColors } from "../../global/const/priorityColors";
import { useCategory } from "../hooks/useCategory";
import { useAttachments } from "../hooks/useAttachment";
import TicketAttachments from "./TicketAttachments";
import ConfirmDialog from "../../global/components/ConfirmDialog";

const AddTicketModal = ({ ticket, isOpen, onClose, onSubmit }) => {
  const { items: attachments, download, remove } = useAttachments();
  const {
    departments,
    loading: loadingDept,
    error: errorDept,
  } = useDepartment();
  const { categories, loading: loadingCat, error: errorCat } = useCategory([]);
  const priorities = Object.keys(priorityColors);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    departmentId: "",
    priority: "",
    categoryId: "",
    description: "",
    attachments: [],
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: ticket?.title || "",
        departmentId: ticket?.department?.id || "",
        priority: ticket?.priority || "",
        categoryId: ticket?.category?.id || "",
        description: ticket?.description || "",
        attachments: attachments,
      });
      setFormErrors({});
    }
  }, [isOpen, ticket]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  const handleRemoveFile = (index) => {
    const file = formData.attachments[index];
    if (!(file instanceof File) && file.id) {
      setConfirmDeleteId(file.id);
    } else {
      setFormData((prev) => {
        const updated = [...prev.attachments];
        updated.splice(index, 1);
        return { ...prev, attachments: updated };
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onSubmit({ ...formData, id: ticket?.id });
    if (result?.validationErrors) {
      setFormErrors(result.validationErrors);
      return;
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Header cố định */}
          <div className="flex justify-between items-center px-6 py-2 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shrink-0">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {ticket ? "Edit Ticket" : "Create New Ticket"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Form */}
          <div className="overflow-y-auto px-6 flex-1 custom-scrollbar">
            <form
              id="ticketForm"
              onSubmit={handleSubmit}
              className="p-6 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    maxLength={100}
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter ticket title"
                    className={`w-full rounded-lg p-2.5 bg-gray-50 dark:bg-gray-800 border ${
                      formErrors.title
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-700"
                    }`}
                  />
                  {formErrors.title && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.title}
                    </p>
                  )}
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Department
                  </label>
                  {loadingDept ? (
                    <p className="text-gray-500 text-sm">Loading...</p>
                  ) : (
                    <select
                      name="departmentId"
                      value={formData.departmentId}
                      onChange={handleChange}
                      className="w-full rounded-lg p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                    >
                      <option value="">Select department</option>
                      {departments
                        ?.filter((d) => d?.id)
                        .map((d) => (
                          <option key={`dept-${d.id}`} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                    </select>
                  )}
                  {formErrors.departmentId && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.departmentId}
                    </p>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full rounded-lg p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                  >
                    <option value="">Select priority</option>
                    {priorities.map((p, idx) => (
                      <option key={`${p}-${idx}`} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  {formErrors.priority && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.priority}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  {loadingCat ? (
                    <p className="text-gray-500 text-sm">Loading...</p>
                  ) : (
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full rounded-lg p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat, idx) => (
                        <option key={cat.id || `cat-${idx}`} value={cat.id}>
                          {cat.categoryName}
                        </option>
                      ))}
                    </select>
                  )}
                  {formErrors.categoryId && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.categoryId}
                    </p>
                  )}
                </div>
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
                  rows={4}
                  placeholder="Describe your issue or request..."
                  className="w-full rounded-lg p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                />
              </div>

              {/* Attachments */}
              <div className="pt-2">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Paperclip className="w-4 h-4" /> Attachments
                </label>
                <TicketAttachments
                  attachments={formData.attachments}
                  onDownload={download}
                  onRemove={handleRemoveFile}
                  onUpload={handleFileChange}
                  ticket={ticket}
                  mode={ticket ? "edit" : "add"}
                />
              </div>
            </form>
          </div>
          {/* Footer cố định */}
          <div
            className="flex justify-end gap-3 px-6 py-4 border-t dark:border-gray-700 
                  bg-gray-50 dark:bg-gray-800 shrink-0"
          >
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 
                 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="ticketForm"
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 
                 text-white font-medium shadow-sm"
            >
              Save
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Confirm delete */}
      <ConfirmDialog
        open={!!confirmDeleteId}
        onConfirm={() => {
          remove(confirmDeleteId);
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
    </AnimatePresence>
  );
};

export default AddTicketModal;
