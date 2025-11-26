import { X, Loader2, AlertTriangle } from "lucide-react";
import { useState } from "react";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const DocumentUploadPanel = ({
  pendingFiles,
  setPendingFiles,
  types,
  onUpload,
  uploading,
  profileId,
}) => {
  const [error, setError] = useState("");
  const allTyped = pendingFiles.every((item) => item.typeId);

  const handleMetaChange = (index, field, value) => {
    const updated = [...pendingFiles];
    updated[index][field] = value;
    setPendingFiles(updated);
  };

  const handleSubmit = () => {
    // 🔹 Kiểm tra kích thước file
    const tooLarge = pendingFiles.find(
      (f) => f.file && f.file.size > MAX_FILE_SIZE
    );
    if (tooLarge) {
      setError(
        `❌ File "${tooLarge.file.name}" vượt quá dung lượng cho phép (tối đa 50MB).`
      );
      return;
    }

    setError("");
    const metaList = pendingFiles.map((item) => ({
      documentTypeId: item.typeId,
      title: item.title,
      description: item.description,
      employeeId: profileId,
    }));
    onUpload(metaList);
  };

  return (
    <div className="p-4 border rounded-2xl bg-gray-50 mt-3 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">
          Thông tin tài liệu tải lên ({pendingFiles.length})
        </h3>
        <button onClick={() => setPendingFiles([])}>
          <X size={16} className="text-gray-500 hover:text-red-600" />
        </button>
      </div>

      {/* ⚠️ Cảnh báo lỗi nếu có */}
      {error && (
        <div className="flex items-center gap-2 bg-red-100 text-red-700 text-sm p-2 rounded-xl">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      {pendingFiles.map((item, idx) => (
        <div
          key={idx}
          className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-3 rounded-xl border"
        >
          <input
            type="text"
            value={item.title}
            onChange={(e) => handleMetaChange(idx, "title", e.target.value)}
            placeholder="Tên tài liệu"
            className="border rounded-lg px-2 py-1 text-sm"
          />
          <select
            value={item.typeId}
            onChange={(e) => handleMetaChange(idx, "typeId", e.target.value)}
            className="border rounded-lg px-2 py-1 text-sm"
          >
            <option value="">-- Loại tài liệu --</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={item.description}
            onChange={(e) =>
              handleMetaChange(idx, "description", e.target.value)
            }
            placeholder="Ghi chú"
            className="border rounded-lg px-2 py-1 text-sm"
          />
        </div>
      ))}

      <div className="flex justify-end items-center gap-3">
        {allTyped ? (
          <button
            disabled={uploading}
            onClick={handleSubmit}
            className={`mt-2 px-4 py-1.5 text-sm rounded-xl text-white flex items-center gap-2 justify-center ${
              uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {uploading && <Loader2 size={16} className="animate-spin" />}
            {uploading ? "Đang tải lên..." : "Xác nhận tải lên"}
          </button>
        ) : (
          <div className="text-sm text-red-500 mt-1">
            ⚠️ Vui lòng chọn loại tài liệu cho tất cả file trước khi tải lên.
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUploadPanel;
