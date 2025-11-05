import { useState, useRef, useEffect } from "react";
import { Upload, X, Download, Loader2 } from "lucide-react";
import Section from "./Section";
import { useDocument } from "../hooks/useDocument";

const DocumentsTab = ({ profile }) => {
  const fileInputRef = useRef(null);
  const [pendingFiles, setPendingFiles] = useState([]);

  const {
    documents,
    types,
    loading,
    uploading,
    downloading,
    getTypes,
    uploadDocuments,
    downloadDocument,
    downloadingIds,
    getMyDocuments,
  } = useDocument();

  useEffect(() => {
    getMyDocuments();
  }, [getMyDocuments]);

  // ======================= EFFECT =======================
  useEffect(() => {
    getTypes();
  }, [getTypes]);

  const allTyped = pendingFiles.every((item) => item.typeId);

  // ======================= HANDLERS =======================
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

  const handleUpload = async () => {
    if (pendingFiles.length === 0) return;

    const formData = new FormData();
    pendingFiles.forEach((item) => formData.append("files", item.file));

    const metaList = pendingFiles.map((item) => ({
      documentTypeId: item.typeId,
      title: item.title,
      description: item.description,
      employeeId: profile.id,
    }));

    formData.append(
      "meta",
      new Blob([JSON.stringify(metaList)], { type: "application/json" })
    );

    await uploadDocuments(formData);
    setPendingFiles([]);
  };

  const handleDownload = (id) => {
    downloadDocument(id);
  };

  // ======================= STATE CHO TÌM KIẾM & LỌC =======================
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  // ======================= LỌC DỮ LIỆU =======================
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = !filterType || doc.documentTypeName === filterType;
    return matchesSearch && matchesType;
  });

  // ======================= RENDER =======================
  return (
    <Section
      title="Tài liệu nhân sự"
      right={
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || downloading}
          className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium border rounded-xl transition ${
            uploading || downloading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-50"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Đang tải lên...
            </>
          ) : (
            <>
              <Upload size={16} /> Tải lên
            </>
          )}
        </button>
      }
    >
      {/* Input file ẩn */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleSelectFiles}
      />

      {/* ===== Loading lấy loại tài liệu ===== */}
      {loading && (
        <div className="mt-3 flex items-center gap-2 text-gray-500 text-sm">
          <Loader2 size={16} className="animate-spin" />
          <span>Đang tải danh sách loại tài liệu...</span>
        </div>
      )}

      {/* ====== Nhập thông tin upload ====== */}
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

          {allTyped && (
            <button
              disabled={uploading}
              onClick={handleUpload}
              className={`mt-2 px-4 py-1.5 text-sm rounded-xl text-white flex items-center gap-2 justify-center ${
                uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {uploading && <Loader2 size={16} className="animate-spin" />}
              {uploading ? "Đang tải lên..." : "Xác nhận tải lên"}
            </button>
          )}

          {!allTyped && (
            <div className="text-sm text-red-500 mt-1">
              ⚠️ Vui lòng chọn loại tài liệu cho tất cả file trước khi tải lên.
            </div>
          )}
        </div>
      )}

      {/* ===== Thanh tìm kiếm & lọc ===== */}
      <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Ô tìm kiếm */}
        <div className="flex items-center w-full sm:w-1/2 relative">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm theo tên tài liệu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Bộ lọc loại tài liệu */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border rounded-xl px-3 py-2 text-sm text-gray-700 bg-white"
          >
            <option value="">-- Tất cả loại tài liệu --</option>
            {types.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>

          {/* Nút làm mới */}
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterType("");
            }}
            className="px-3 py-2 text-sm border rounded-xl hover:bg-gray-50 transition"
          >
            Làm mới
          </button>
        </div>
      </div>

      {/* ===== Danh sách tài liệu ===== */}
      <div className="mt-5 border rounded-xl overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 border">Tên tài liệu</th>
              <th className="p-2 border">Loại</th>
              <th className="p-2 border">Ngày tải lên</th>
              <th className="p-2 border">Ghi chú</th>
              <th className="p-2 border text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments?.length > 0 ? (
              filteredDocuments.map((doc) => {
                const isDownloading = downloadingIds.includes(doc.id);
                return (
                  <tr
                    key={doc.id}
                    className="hover:bg-gray-50 even:bg-gray-50/50"
                  >
                    <td className="p-2 border">{doc.title}</td>
                    <td className="p-2 border">{doc.documentTypeName}</td>
                    <td className="p-2 border">
                      {new Date(doc.uploadDate).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="p-2 border">{doc.description || "-"}</td>
                    <td className="p-2 border text-center">
                      <button
                        onClick={() => handleDownload(doc.id)}
                        disabled={isDownloading}
                        className={`flex items-center gap-1 text-blue-600 mx-auto ${
                          isDownloading
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:underline"
                        }`}
                      >
                        {isDownloading ? (
                          <>
                            <Loader2 size={14} className="animate-spin" /> Đang
                            tải...
                          </>
                        ) : (
                          <>
                            <Download size={14} /> Tải xuống
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-4 text-gray-500 italic"
                >
                  Chưa có tài liệu nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Section>
  );
};

export default DocumentsTab;
