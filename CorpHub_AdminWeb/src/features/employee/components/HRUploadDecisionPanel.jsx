import React, { useState, useRef } from "react";
import { X, Upload, Trash2, FileText, AlertCircle } from "lucide-react";
import { showSuccess, showError } from "../../../utils/toastUtils";

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx", ".xls", ".xlsx"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function HRUploadDecisionPanel({
  request,
  onClose,
  onUploadSuccess,
  uploading,
  uploadProgress,
}) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileNames, setFileNames] = useState({}); // { fileIndex: customName }
  const [notes, setNotes] = useState("");
  const fileInputRef = useRef(null);

  const generateFileName = (employee, position) => {
    const date = new Date().toISOString().split("T")[0];
    return `${employee}_${position}_${date}`.replace(/\s+/g, "_");
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = [];

    files.forEach((file) => {
      const ext = `.${file.name.split(".").pop()}`.toLowerCase();

      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        showError(
          `File ${file.name} không được hỗ trợ. Chỉ chấp nhận: PDF, Word, Excel`
        );
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        showError(
          `File ${file.name} vượt quá 10MB. Vui lòng chọn file nhỏ hơn.`
        );
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
      // Auto-generate names for new files
      const newNames = { ...fileNames };
      validFiles.forEach((file, idx) => {
        const index = selectedFiles.length + idx;
        if (!newNames[index]) {
          newNames[index] = generateFileName(
            request.employeeName,
            request.newPositionName
          );
        }
      });
      setFileNames(newNames);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    const newNames = { ...fileNames };
    delete newNames[index];
    setFileNames(newNames);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      showError("Vui lòng chọn ít nhất 1 file");
      return;
    }

    try {
      await onUploadSuccess(request.id, selectedFiles, notes);
      showSuccess("Upload quyết định thành công!");
      setSelectedFiles([]);
      setFileNames({});
      setNotes("");
      onClose?.();
    } catch (err) {
      showError("Upload thất bại");
      console.error(err);
    }
  };

  return (
    <div className="fixed right-0 top-0 h-screen w-96 bg-white dark:bg-gray-800 shadow-xl z-40 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Upload Quyết Định
        </h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Request Info */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
            {request.employeeName}
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
            {request.oldPositionName} → {request.newPositionName}
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Hiệu lực: {new Date(request.effectDate).toLocaleDateString("vi-VN")}
          </p>
        </div>

        {/* Approval Steps Summary */}
        {request.approvalSteps?.length > 0 && (
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">
              Các bước duyệt:
            </p>
            <div className="space-y-1">
              {request.approvalSteps.map((step) => (
                <div
                  key={step.id}
                  className="text-xs text-gray-700 dark:text-gray-300 flex items-center gap-1"
                >
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      step.decision === "APPROVED"
                        ? "bg-green-500"
                        : step.decision === "REJECTED"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  />
                  <span>
                    [{step.role}] {step.approver?.fullName || "-"}:{" "}
                    {step.decision}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* File Upload Zone */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Tải lên file quyết định
          </label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add("bg-blue-50", "border-blue-400");
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove("bg-blue-50", "border-blue-400");
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove("bg-blue-50", "border-blue-400");
              handleFileSelect({
                target: { files: e.dataTransfer.files },
              });
            }}
            className="mt-2 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer transition"
          >
            <Upload className="mx-auto mb-2 text-gray-400" size={24} />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Kéo thả file hoặc click để chọn
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              PDF, Word, Excel. Tối đa 10MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
            >
              Chọn file
            </button>
          </div>
        </div>

        {/* File List */}
        {selectedFiles.length > 0 && (
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Các file được chọn ({selectedFiles.length})
            </label>
            <div className="mt-2 space-y-2">
              {selectedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-start gap-2">
                    <FileText
                      size={16}
                      className="text-gray-500 mt-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(idx)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 flex-shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Ghi chú (tùy chọn)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Thêm bất kỳ ghi chú nào về quyết định này"
            className="mt-1 w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            rows="3"
          />
        </div>

        {/* Info */}
        <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded border border-yellow-200 dark:border-yellow-700 flex gap-2">
          <AlertCircle
            size={16}
            className="text-yellow-600 flex-shrink-0 mt-0.5"
          />
          <p className="text-xs text-yellow-700 dark:text-yellow-200">
            Khi upload thành công, request sẽ được hoàn thành.
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {uploading && uploadProgress > 0 && (
        <div className="px-4 py-2 border-t dark:border-gray-700">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {Math.round(uploadProgress)}%
          </p>
        </div>
      )}

      {/* Footer Buttons */}
      <div className="p-4 border-t dark:border-gray-700 space-y-2 bg-white dark:bg-gray-800">
        <button
          onClick={handleUpload}
          disabled={uploading || selectedFiles.length === 0}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
        >
          {uploading
            ? `Đang upload ${Math.round(uploadProgress)}%...`
            : "Upload"}
        </button>
        <button
          onClick={onClose}
          disabled={uploading}
          className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
