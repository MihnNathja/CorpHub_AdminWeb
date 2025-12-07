import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useAbsenceType } from "../hooks/useAbsenceType";
import { useAbsenceRequest } from "../hooks/useAbsenceRequest";
import { useDispatch } from "react-redux";
import {
  setDraftAttachment,
  clearDraftAttachment,
} from "../store/absenceRequestSlice";
import { showError } from "../../../utils/toastUtils";
import { downloadAttachment } from "../service/absenceRequestApi";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  CalendarCheck,
  Download,
} from "lucide-react";

const AbsenceRequestModal = ({ onClose, onSubmit, editingItem }) => {
  const { absenceTypes } = useAbsenceType();

  const [form, setForm] = useState({
    absenceTypeId: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [selectedType, setSelectedType] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = React.useRef(null);

  // use hook/slice for upload state
  const {
    uploadAttachment,
    removeAttachment,
    deleteAttachment,
    replaceAttachment,
    draftAttachment,
    uploading,
  } = useAbsenceRequest();
  const dispatch = useDispatch();

  useEffect(() => {
    if (editingItem) {
      setForm({
        absenceTypeId: editingItem.absenceType.id,
        startDate: dayjs(editingItem.startDate).format("YYYY-MM-DD"),
        endDate: dayjs(editingItem.endDate).format("YYYY-MM-DD"),
        reason: editingItem.reason,
      });

      const type = absenceTypes.find(
        (t) => t.id === editingItem.absenceType.id
      );
      setSelectedType(type || null);

      // If editing item already has an attachmentUrl, initialize draftAttachment in slice
      if (editingItem.attachmentUrl) {
        const payload = {
          fileKey: editingItem.attachmentKey || null,
          fileUrl: editingItem.attachmentUrl,
          fileName: editingItem.attachmentName || "Tệp đính kèm",
        };
        dispatch(setDraftAttachment(payload));
      } else {
        dispatch(clearDraftAttachment());
      }
    }
    setErrors({});
  }, [editingItem, absenceTypes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "absenceTypeId") {
      const type = absenceTypes.find((t) => t.id === value);
      setSelectedType(type || null);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.absenceTypeId)
      newErrors.absenceTypeId = "Vui lòng chọn loại nghỉ";
    if (!form.startDate) newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
    if (!form.endDate) newErrors.endDate = "Vui lòng chọn ngày kết thúc";
    if (
      form.startDate &&
      form.endDate &&
      dayjs(form.endDate).isBefore(dayjs(form.startDate))
    ) {
      newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
    }
    if (!form.reason.trim()) newErrors.reason = "Vui lòng nhập lý do";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const requestBody = {
      absenceTypeId: form.absenceTypeId,
      startDate: form.startDate,
      endDate: form.endDate,
      reason: form.reason,
    };

    // include attachment info if uploaded (from slice)
    if (draftAttachment) {
      // sẽ dùng key làm url để lưu
      //   if (draftAttachment.fileUrl)
      //     requestBody.attachmentUrl = draftAttachment.fileUrl;
      if (draftAttachment.fileKey)
        requestBody.attachmentUrl = draftAttachment.fileKey;
    } else if (editingItem?.attachmentUrl) {
      // fallback to existing attachment on editing item
      requestBody.attachmentUrl = editingItem.attachmentUrl;
      if (editingItem.attachmentKey)
        requestBody.attachmentKey = editingItem.attachmentKey;
    }

    onSubmit(requestBody);
  };

  // Calculate days
  const calculateDays = () => {
    if (form.startDate && form.endDate) {
      const start = dayjs(form.startDate);
      const end = dayjs(form.endDate);
      const days = end.diff(start, "day") + 1;
      return days > 0 ? days : 0;
    }
    return 0;
  };

  const days = calculateDays();
  console.log(editingItem);

  const handleDownload = async () => {
    try {
      const objectKey = draftAttachment?.fileKey || editingItem?.attachmentUrl;
      console.log(objectKey);
      if (!objectKey) {
        window.open(
          editingItem?.attachmentUrl || draftAttachment?.fileUrl,
          "_blank"
        );
        return;
      }

      const blob = await downloadAttachment(objectKey);
      const fileBlob = blob instanceof Blob ? blob : new Blob([blob]);
      const url = window.URL.createObjectURL(fileBlob);
      const a = document.createElement("a");
      a.href = url;
      const filename =
        (draftAttachment && draftAttachment.fileName) ||
        editingItem?.attachmentName ||
        "attachment";
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      showError("Không thể tải tệp xuống");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-6 py-5 text-white">
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
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {editingItem ? "Chỉnh sửa đơn nghỉ" : "Tạo đơn nghỉ mới"}
                  </h2>
                  <p className="text-xs text-white/80">
                    {editingItem
                      ? "Cập nhật thông tin đơn nghỉ"
                      : "Điền thông tin đơn xin nghỉ phép"}
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

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Absence Type */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Loại nghỉ phép
              </label>
              <select
                name="absenceTypeId"
                value={form.absenceTypeId}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all
                                    ${
                                      errors.absenceTypeId
                                        ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                                        : "border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20"
                                    }
                                    bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                                    focus:outline-none cursor-pointer`}
              >
                <option value="">-- Chọn loại nghỉ --</option>
                {absenceTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.absenceTypeId && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1"
                >
                  <AlertTriangle className="w-3 h-3" />
                  {errors.absenceTypeId}
                </motion.p>
              )}

              {/* Warning for proof requirement */}
              {selectedType?.requireProof && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                        Yêu cầu minh chứng
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                        Loại nghỉ này cần có giấy tờ chứng minh. Vui lòng tải
                        lên tệp liên quan.
                      </p>

                      {/* Upload area */}
                      <div className="mt-3">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*,application/pdf"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files && e.target.files[0];
                            if (!file) return;
                            try {
                              await uploadAttachment(file);
                            } catch (err) {
                              console.error(err);
                              showError("Upload thất bại");
                            } finally {
                              // clear the input so same file can be picked again if needed
                              e.target.value = null;
                            }
                          }}
                        />

                        {!draftAttachment && !editingItem?.attachmentUrl && (
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-semibold hover:bg-gray-100 transition-colors"
                            >
                              Chọn tệp
                            </button>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              PDF, ảnh (tối đa 10MB)
                            </p>
                          </div>
                        )}

                        {uploading && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                            Đang tải lên...
                          </p>
                        )}

                        {(draftAttachment || editingItem?.attachmentUrl) && (
                          <div className="mt-2 space-y-2">
                            {/* Display current attachment */}
                            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                <a
                                  href={
                                    draftAttachment?.fileUrl ||
                                    editingItem?.attachmentUrl
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium truncate"
                                >
                                  {(draftAttachment &&
                                    draftAttachment.fileName) ||
                                    editingItem?.attachmentName ||
                                    "Tệp đính kèm"}
                                </a>
                              </div>
                              <button
                                type="button"
                                onClick={handleDownload}
                                className="inline-flex items-center gap-1 ml-2 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 px-2 py-1 rounded border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex-shrink-0"
                              >
                                <Download className="w-3.5 h-3.5" />
                                Tải
                              </button>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-2 justify-end">
                              <button
                                type="button"
                                onClick={async () => {
                                  const file = await new Promise((resolve) => {
                                    const input =
                                      document.createElement("input");
                                    input.type = "file";
                                    input.accept = "image/*,application/pdf";
                                    input.onchange = (e) => {
                                      resolve(e.target.files?.[0]);
                                    };
                                    input.click();
                                  });
                                  if (!file) return;
                                  try {
                                    const oldKey =
                                      draftAttachment?.fileKey ||
                                      editingItem?.attachmentUrl;
                                    if (oldKey) {
                                      await replaceAttachment(oldKey, file);
                                    }
                                  } catch (err) {
                                    console.error(err);
                                    showError("Thay thế tệp thất bại");
                                  }
                                }}
                                className="text-xs px-3 py-1.5 rounded border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors font-semibold"
                              >
                                Thay đổi
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  try {
                                    const objectKey =
                                      draftAttachment?.fileKey ||
                                      editingItem?.attachmentUrl;
                                    if (objectKey) {
                                      await deleteAttachment(objectKey);
                                    } else {
                                      removeAttachment();
                                    }
                                  } catch (err) {
                                    console.error(err);
                                    showError("Xóa tệp thất bại");
                                  }
                                }}
                                className="text-xs px-3 py-1.5 rounded border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors font-semibold"
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Từ ngày
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all
                                        ${
                                          errors.startDate
                                            ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                                            : "border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20"
                                        }
                                        bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                                        focus:outline-none cursor-pointer`}
                />
                {errors.startDate && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    {errors.startDate}
                  </motion.p>
                )}
              </div>

              {/* End Date */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  Đến ngày
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all
                                        ${
                                          errors.endDate
                                            ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                                            : "border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-500/20"
                                        }
                                        bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                                        focus:outline-none cursor-pointer`}
                />
                {errors.endDate && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    {errors.endDate}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Days Counter */}
            {days > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-600 dark:bg-blue-500">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Tổng số ngày nghỉ
                    </p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {days} ngày
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Reason */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Lý do nghỉ phép
              </label>
              <textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="Vui lòng mô tả rõ lý do xin nghỉ phép..."
                rows={4}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all
                                    ${
                                      errors.reason
                                        ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                                        : "border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20"
                                    }
                                    bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                                    placeholder:text-gray-400 dark:placeholder:text-gray-500
                                    focus:outline-none resize-none`}
              />
              {errors.reason && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1"
                >
                  <AlertTriangle className="w-3 h-3" />
                  {errors.reason}
                </motion.p>
              )}
            </div>
          </form>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={async () => {
                // Cleanup: delete draft attachment if exists before closing
                try {
                  if (draftAttachment?.fileKey) {
                    await deleteAttachment(draftAttachment.fileKey);
                  }
                } catch (err) {
                  console.error("Cleanup error:", err);
                } finally {
                  onClose();
                }
              }}
              className="px-5 py-2.5 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Hủy bỏ
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {editingItem ? "Cập nhật" : "Gửi đơn"}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AbsenceRequestModal;
