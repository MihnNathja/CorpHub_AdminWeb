import { AlertCircle } from "lucide-react";
import { useCompetencyForm } from "../../../hooks/useCompetencyForm";
import CompetencyBasicInfo from "./CompetencyBasicInfo";
import CompetencyFileUpload from "./CompetencyFileUpload";

export default function AddCompetencyForm({ profile, onCancel, onAdded }) {
  const {
    form,
    error,
    loading,
    uploading,
    types,
    docTypes,
    levelOptions,
    showCustomLevel,
    pendingFiles,
    fileInputRef,
    canSubmit,
    setError,
    setForm,
    setPendingFiles,
    handleChange,
    handleTypeChange,
    handleLevelChange,
    handleSelectFile,
    handleUpload,
    resetForm,
    documents,
    getMyDocuments,
  } = useCompetencyForm(profile);

  const handleSubmit = () => {
    if (!form.name)
      return setError("Vui lòng nhập tên chứng chỉ hoặc kỹ năng!");
    if (!form.typeId) return setError("Vui lòng chọn loại năng lực!");
    if (!form.levelName) return setError("Vui lòng chọn hoặc nhập cấp độ!");
    if (!canSubmit) return setError("Vui lòng tải lên hoặc chọn file!");

    const payload = { ...form, verificationStatus: "PENDING" };
    onAdded?.(payload);
    resetForm();
  };

  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm">
      <h4 className="font-medium mb-3 text-sm flex items-center gap-2">
        ➕ Thêm chứng chỉ / kỹ năng
      </h4>

      {loading && (
        <p className="text-xs text-gray-500 mb-2">Đang tải dữ liệu...</p>
      )}

      <CompetencyBasicInfo
        form={form}
        types={types}
        levelOptions={levelOptions}
        showCustomLevel={showCustomLevel}
        handleChange={handleChange}
        handleTypeChange={handleTypeChange}
        handleLevelChange={handleLevelChange}
      />

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

      {error && (
        <div className="mt-3 flex items-center gap-2 text-red-600 text-xs">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 border rounded text-sm hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          disabled={!canSubmit}
          onClick={handleSubmit}
          className={`px-4 py-2 rounded text-white text-sm ${
            canSubmit
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Thêm năng lực
        </button>
      </div>
    </div>
  );
}
