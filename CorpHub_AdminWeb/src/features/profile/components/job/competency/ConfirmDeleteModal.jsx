import { X } from "lucide-react";
import { useEffect } from "react";

export default function ConfirmDeleteModal({
  open,
  title = "Xác nhận xóa",
  message = "Bạn có chắc chắn muốn xóa mục này không?",
  confirmLabel = "Xóa",
  cancelLabel = "Hủy",
  isDeletedFile = false,
  setIsDeletedFile, // 🟢 thêm setter
  onConfirm,
  onClose,
}) {
  // Đóng modal khi nhấn ESC
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl w-[400px] p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold mb-3 text-gray-800">{title}</h2>

        {/* Message */}
        <p className="text-sm text-gray-600 mb-4">{message}</p>

        {/* Checkbox xóa file đính kèm */}
        <label className="flex items-center gap-2 text-sm text-gray-700 mb-5 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 accent-red-500"
            checked={isDeletedFile}
            onChange={(e) => setIsDeletedFile?.(e.target.checked)} // ✅ sửa chỗ này
          />
          Xóa luôn file đính kèm
        </label>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm?.();
              onClose?.();
            }}
            className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
