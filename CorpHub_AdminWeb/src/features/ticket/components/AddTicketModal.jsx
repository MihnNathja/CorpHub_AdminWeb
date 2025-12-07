import React, { useState, useEffect } from "react";
import {
  X,
  Upload,
  Paperclip,
  Ticket,
  Building2,
  AlertCircle,
  Tag,
  FileText,
  Zap,
  CheckCircle
} from "lucide-react";
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

  // Priority config with colors
  const priorityConfig = {
    LOW: {
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      icon: CheckCircle,
    },
    MEDIUM: {
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      icon: AlertCircle,
    },
    HIGH: {
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-900/20",
      icon: Zap,
    },
    URGENT: {
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      icon: Zap,
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-6 py-5 text-white shrink-0">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl"
            />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
                  <Ticket className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {ticket ? "Chỉnh sửa Ticket" : "Tạo Ticket mới"}
                  </h2>
                  <p className="text-xs text-white/80">
                    {ticket ? "Cập nhật thông tin ticket" : "Tạo yêu cầu hỗ trợ mới"}
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Form */}
          <div className="overflow-y-auto px-6 py-6 flex-1 custom-scrollbar">
            <form id="ticketForm" onSubmit={handleSubmit} className="space-y-5">
              {/* Title - Full Width */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Ticket className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Tiêu đề
                </label>
                <input
                  type="text"
                  name="title"
                  maxLength={100}
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Nhập tiêu đề ticket..."
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all
                    ${formErrors.title
                      ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                      : "border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20"
                    }
                    bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                    placeholder:text-gray-400 dark:placeholder:text-gray-500
                    focus:outline-none`}
                />
                {formErrors.title && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {formErrors.title}
                  </motion.p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Department */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    Phòng ban
                  </label>
                  {loadingDept ? (
                    <div className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 text-sm animate-pulse">
                      Đang tải...
                    </div>
                  ) : (
                    <select
                      name="departmentId"
                      value={formData.departmentId}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all
                        ${formErrors.departmentId
                          ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                          : "border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20"
                        }
                        bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                        focus:outline-none cursor-pointer`}
                    >
                      <option value="">-- Chọn phòng ban --</option>
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
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.departmentId}
                    </motion.p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <Tag className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    Danh mục
                  </label>
                  {loadingCat ? (
                    <div className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 text-sm animate-pulse">
                      Đang tải...
                    </div>
                  ) : (
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all
                        ${formErrors.categoryId
                          ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                          : "border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20"
                        }
                        bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                        focus:outline-none cursor-pointer`}
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map((cat, idx) => (
                        <option key={cat.id || `cat-${idx}`} value={cat.id}>
                          {cat.categoryName}
                        </option>
                      ))}
                    </select>
                  )}
                  {formErrors.categoryId && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.categoryId}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Độ ưu tiên
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {priorities.map((p) => {
                    const config = priorityConfig[p] || priorityConfig.MEDIUM;
                    const Icon = config.icon;
                    const isSelected = formData.priority === p;
                    return (
                      <motion.button
                        key={p}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, priority: p }))
                        }
                        className={`relative p-3 rounded-xl border-2 transition-all text-center
                          ${isSelected
                            ? `${config.bg} border-current ${config.color} shadow-lg`
                            : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                          }`}
                      >
                        <Icon
                          className={`w-5 h-5 mx-auto mb-1 ${isSelected ? config.color : ""
                            }`}
                        />
                        <p className="text-xs font-semibold">{p}</p>
                        {isSelected && (
                          <motion.div
                            layoutId="priorityIndicator"
                            className="absolute inset-0 rounded-xl border-2 border-current"
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
                {formErrors.priority && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {formErrors.priority}
                  </motion.p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Mô tả chi tiết
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Mô tả chi tiết vấn đề hoặc yêu cầu của bạn..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 
                    focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20
                    bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                    placeholder:text-gray-400 dark:placeholder:text-gray-500
                    focus:outline-none resize-none transition-all"
                />
              </div>

              {/* Attachments */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Paperclip className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Tệp đính kèm
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

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 shrink-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Hủy bỏ
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              form="ticketForm"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {ticket ? "Cập nhật" : "Tạo ticket"}
            </motion.button>
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
