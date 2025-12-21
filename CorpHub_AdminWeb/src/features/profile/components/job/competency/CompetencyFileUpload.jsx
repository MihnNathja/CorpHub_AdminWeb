import { useEffect, useMemo, useState } from "react";
import { Upload, Loader2, CheckCircle, FileText } from "lucide-react";
import DocumentUploadPanel from "../../document/DocumentUploadPanel";
import DocumentFilterBar from "../../document/DocumentFilterBar";

export default function CompetencyFileUpload({
  form,
  uploading,
  fileInputRef,
  pendingFiles,
  setPendingFiles,
  docTypes,
  handleSelectFile,
  handleUpload,
  setForm,
  // 🔹 thêm props mới
  documents = [],
  loadDocuments,
}) {
  const [mode, setMode] = useState("select"); // "select" | "upload"

  useEffect(() => {
    if (documents.length === 0) loadDocuments?.();
  }, [documents.length]);

  const handleSelectExisting = (e) => {
    const id = e.target.value;
    const selected = documents.find((d) => d.id === id);
    if (selected) {
      setForm((f) => ({
        ...f,
        documentId: selected.id,
        uploaded: true,
        fileName: selected.name,
      }));
    }
  };

  const handleUploadAndRefresh = async (metaList) => {
    await handleUpload(metaList);
    if (loadDocuments) await loadDocuments();
  };

  const handleRemove = () => {
    setForm((f) => ({
      ...f,
      documentId: "",
      uploaded: false,
      file: null,
      fileName: "",
    }));
    setMode("select");
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchSearch = doc.fileName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchType = !filterType || doc.typeName === filterType;
      return matchSearch && matchType;
    });
  }, [documents, searchTerm, filterType]);

  // ==================================================
  return (
    <div className="mt-4 space-y-3">
      {!form.documentId ? (
        <>
          {/* Mode selection */}
          <div className="flex gap-3 items-center">
            <label className="text-sm text-gray-700">Tài liệu:</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode("select")}
                className={`px-3 py-1 rounded border text-xs ${
                  mode === "select"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Choose existing document
              </button>
              <button
                type="button"
                onClick={() => setMode("upload")}
                className={`px-3 py-1 rounded border text-xs ${
                  mode === "upload"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Upload new
              </button>
            </div>
          </div>

          {/* ===================== SELECT EXISTING MODE ===================== */}
          {mode === "select" && (
            <div className="mt-3">
              {/* 🔹 Search & filter */}
              <DocumentFilterBar
                types={docTypes}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterType={filterType}
                setFilterType={setFilterType}
              />

              {/* 🔹 Document list */}
              <div className="mt-3">
                {filteredDocuments.length === 0 ? (
                  <p className="text-xs text-gray-500">
                    ⚠️ No documents found. Check filters or upload a new one.
                  </p>
                ) : (
                  <div className="border rounded-md divide-y max-h-60 overflow-y-auto">
                    {filteredDocuments.map((doc) => {
                      const isSelected = form.documentId === doc.id;
                      return (
                        <div
                          key={doc.id}
                          onClick={() =>
                            setForm((f) => ({
                              ...f,
                              documentId: doc.id,
                              fileName: doc.name || doc.fileName,
                              uploaded: true,
                            }))
                          }
                          className={`flex items-center justify-between p-2 text-sm cursor-pointer ${
                            isSelected
                              ? "bg-blue-50 border-l-4 border-blue-500"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-blue-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                            </span>
                            <div>
                              <p
                                className={`font-medium ${
                                  isSelected ? "text-blue-600" : "text-gray-800"
                                }`}
                              >
                                {doc.name || doc.fileName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {doc.fileType?.split("/")[1]?.toUpperCase() ||
                                  "Document"}
                                {doc.createdAt && (
                                  <>
                                    {" "}
                                    •{" "}
                                    {new Date(doc.createdAt).toLocaleDateString(
                                      "vi-VN"
                                    )}
                                  </>
                                )}
                              </p>
                            </div>
                          </div>
                          {isSelected && (
                            <span className="text-blue-600 text-xs font-medium">
                              Selected
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 🔹 Confirm button */}
                {form.documentId && (
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => {
                        // Giữ lại documentId đã chọn, đóng panel nếu cần
                      }}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Confirm selection
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================== UPLOAD NEW MODE ===================== */}
          {mode === "upload" && (
            <>
              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    console.log("Clicked switch-to-upload mode");
                    fileInputRef.current?.click();
                  }}
                  disabled={uploading}
                  className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg ${
                    uploading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {uploading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />{" "}
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={16} /> Choose certificate file
                    </>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleSelectFile}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
              </div>

              {pendingFiles.length > 0 && (
                <DocumentUploadPanel
                  pendingFiles={pendingFiles}
                  setPendingFiles={setPendingFiles}
                  types={docTypes}
                  onUpload={handleUploadAndRefresh}
                  uploading={uploading}
                />
              )}
            </>
          )}
        </>
      ) : (
        // ===================== DISPLAY WHEN SELECTED =====================
        <div className="border rounded-lg bg-green-50 p-3 flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <CheckCircle size={18} className="text-green-600" />
            <div>
              <p className="font-medium text-gray-800">
                {form.fileName || "Selected document"}
              </p>
              <p className="text-xs text-gray-500">Saved successfully</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                window.open(`/api/documents/${form.documentId}/download`)
              }
              className="text-blue-600 hover:underline text-xs"
            >
              View / download again
            </button>
            <button
              onClick={handleRemove}
              className="text-gray-500 hover:text-red-500 text-xs"
            >
              ✕ Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
