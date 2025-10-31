import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import Section from "./Section";

const documentTypes = [
  { id: "1", name: "CONTRACT" },
  { id: "2", name: "CERTIFICATE" },
  { id: "3", name: "DECISION" },
  { id: "4", name: "OTHER" },
];

const DocumentsTab = ({ profile, onUploadDocuments }) => {
  const fileInputRef = useRef(null);
  const [pendingFiles, setPendingFiles] = useState([]);

  const handleSelectFiles = (e) => {
    const files = Array.from(e.target.files);
    setPendingFiles(
      files.map((f) => ({
        file: f,
        typeId: "",
        title: f.name,
        description: "",
      }))
    );
  };

  const handleMetaChange = (index, field, value) => {
    const updated = [...pendingFiles];
    updated[index][field] = value;
    setPendingFiles(updated);
  };

  const handleUpload = () => {
    if (pendingFiles.length === 0) return;

    const formData = new FormData();
    pendingFiles.forEach((item) => formData.append("files", item.file));

    const metaList = pendingFiles.map((item) => ({
      documentTypeId: item.typeId,
      title: item.title,
      description: item.description,
    }));

    formData.append(
      "meta",
      new Blob([JSON.stringify(metaList)], { type: "application/json" })
    );

    if (onUploadDocuments) onUploadDocuments(formData);
    setPendingFiles([]);
  };

  return (
    <Section
      title="Tài liệu nhân sự"
      right={
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border rounded-xl hover:bg-gray-50"
        >
          <Upload size={16} />
          Tải lên
        </button>
      }
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleSelectFiles}
      />

      {/* Nếu có file chờ upload */}
      {pendingFiles.length > 0 && (
        <div className="p-4 border rounded-2xl bg-gray-50 mt-3 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">
              Thông tin tài liệu tải lên ({pendingFiles.length})
            </h3>
            <button onClick={() => setPendingFiles([])}>
              <X size={16} className="text-gray-500 hover:text-red-600" />
            </button>
          </div>

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
                onChange={(e) =>
                  handleMetaChange(idx, "typeId", e.target.value)
                }
                className="border rounded-lg px-2 py-1 text-sm"
              >
                <option value="">-- Loại tài liệu --</option>
                {documentTypes.map((t) => (
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

          <button
            onClick={handleUpload}
            className="mt-2 px-4 py-1.5 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Xác nhận tải lên
          </button>
        </div>
      )}
    </Section>
  );
};

export default DocumentsTab;
