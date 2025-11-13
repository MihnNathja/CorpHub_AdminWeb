import { useState } from "react";
import { X } from "lucide-react";
import { useCompetencyForm } from "../../../hooks/useCompetencyForm";
import CompetencyFileUpload from "./CompetencyFileUpload";

export default function EditCompetencyModal({ open, data, onClose, onSubmit }) {
  const {
    form,
    setForm,
    error,
    uploading,
    types,
    docTypes,
    levelOptions,
    showCustomLevel,
    pendingFiles,
    fileInputRef,
    canSubmit,
    setError,
    setPendingFiles,
    handleChange,
    handleTypeChange,
    handleLevelChange,
    handleSelectFile,
    handleUpload,
    documents,
    getMyDocuments,
  } = useCompetencyForm(null, data);

  const [file, setFile] = useState(null); // ✅ bổ sung

  if (!open) return null;

  // util: đảm bảo value cho input datetime-local
  const fmtDatetimeLocal = (s) => {
    if (!s) return "";
    // nếu đã là string ISO: "2025-11-12T10:30:00" -> lấy tới phút
    if (typeof s === "string") return s.slice(0, 16);
    // nếu là Date: convert sang yyyy-MM-ddTHH:mm
    const d = new Date(s);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const handleSubmit = async (e) => {
    console.log(">>> EDIT FORM SUBMIT TRIGGERED");
    e.preventDefault();

    let updated = { ...form };

    // Nếu có file mới đang chờ
    if (pendingFiles.length > 0) {
      const uploaded = await handleUpload();
      console.log("Khi ấn submit xong, kết quả:", uploaded);
      if (uploaded?.id) updated.documentId = uploaded.id;
    }

    onSubmit?.(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-[680px] p-6 relative">
        {/* Header */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          ✏️ Chỉnh sửa chứng chỉ
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Tên chứng chỉ</label>
              <input
                name="name"
                type="text"
                value={form.name || ""}
                onChange={handleChange} // ✅ truyền event
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Cấp bởi</label>
              <input
                name="issuedBy"
                type="text"
                value={form.issuedBy || ""}
                onChange={handleChange} // ✅ truyền event
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Loại năng lực</label>
              <select
                value={form.typeId || ""}
                onChange={handleTypeChange} // ✅ dùng handler chuyên dụng
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">-- Chọn loại --</option>
                {types.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Trình độ</label>
              <select
                value={form.levelId || ""}
                onChange={handleLevelChange} // ✅ dùng handler chuyên dụng
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">-- Chọn cấp độ --</option>
                {levelOptions.map((lv) => (
                  <option key={lv.id} value={lv.id}>
                    {lv.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Ngày cấp</label>
              <input
                name="issuedDate"
                type="datetime-local"
                value={fmtDatetimeLocal(form.issuedDate)}
                onChange={handleChange} // ✅ truyền event
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Ngày hết hạn</label>
              <input
                name="expireDate"
                type="datetime-local"
                value={fmtDatetimeLocal(form.expireDate)}
                onChange={handleChange} // ✅ truyền event
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Ghi chú</label>
            <textarea
              name="note"
              rows={2}
              value={form.note || ""}
              onChange={handleChange} // ✅ truyền event
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="border-t pt-3">
            <label className="text-sm text-gray-600">Tệp đính kèm</label>
            <div className="flex items-center gap-3 mt-1">
              <CompetencyFileUpload
                form={form}
                documents={documents}
                loadDocuments={getMyDocuments}
                uploading={uploading}
                fileInputRef={fileInputRef}
                pendingFiles={pendingFiles}
                setPendingFiles={setPendingFiles}
                docTypes={docTypes}
                handleSelectFile={handleSelectFile}
                handleUpload={handleUpload}
                setForm={setForm}
              />

              {form.fileName && (
                <span className="text-xs text-gray-500">{form.fileName}</span>
              )}
            </div>
          </div>

          <div className="border-t pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
