import { useState, useRef, useEffect } from "react";
import { Upload, Loader2, List, LayoutList } from "lucide-react";
import { useDocument } from "../../hooks/useDocument";
import Section from "../Section";
import DocumentUploadPanel from "./DocumentUploadPanel";
import DocumentFilterBar from "./DocumentFilterBar";
import DocumentTableView from "./DocumentTableView";
import DocumentSectionView from "./DocumentSectionView";

const DocumentsTab = ({ profile }) => {
  const fileInputRef = useRef(null);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [viewMode, setViewMode] = useState("section"); // section | table
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  const {
    documents,
    types,
    loading,
    uploading,
    downloading,
    downloadingIds,
    checking,
    deleting,
    relationInfo,
    getTypes,
    getMyDocuments,
    uploadDocuments,
    downloadDocument,
    checkRelations,
    removeDocument,
  } = useDocument();

  // ================== INIT ==================
  useEffect(() => {
    getMyDocuments();
    getTypes();
  }, [getMyDocuments, getTypes]);

  // ================== FILTER ==================
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = !filterType || doc.documentTypeName === filterType;
    return matchesSearch && matchesType;
  });

  // ================== HANDLERS ==================
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

  const handleUpload = async (metaList) => {
    const formData = new FormData();
    pendingFiles.forEach((item) => formData.append("files", item.file));
    formData.append(
      "meta",
      new Blob([JSON.stringify(metaList)], { type: "application/json" })
    );
    await uploadDocuments(formData);
    setPendingFiles([]);
  };

  // ================== RENDER ==================
  return (
    <Section
      title="Tài liệu nhân sự"
      right={
        <div className="flex items-center gap-3">
          {/* Toggle dạng hiển thị */}
          <button
            onClick={() =>
              setViewMode(viewMode === "table" ? "section" : "table")
            }
            className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-xl hover:bg-gray-50 transition"
          >
            {viewMode === "table" ? (
              <>
                <LayoutList size={16} /> Dạng section
              </>
            ) : (
              <>
                <List size={16} /> Dạng bảng
              </>
            )}
          </button>

          {/* Nút tải lên */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || downloading}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm border rounded-xl ${
              uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
            }`}
          >
            {uploading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Đang tải...
              </>
            ) : (
              <>
                <Upload size={16} /> Tải lên
              </>
            )}
          </button>
        </div>
      }
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleSelectFiles}
      />

      {/* Hiển thị form nhập thông tin upload */}
      {pendingFiles.length > 0 && (
        <DocumentUploadPanel
          pendingFiles={pendingFiles}
          setPendingFiles={setPendingFiles}
          types={types}
          onUpload={handleUpload}
          uploading={uploading}
          profileId={profile.id}
        />
      )}

      {/* Thanh tìm kiếm và lọc */}
      <DocumentFilterBar
        types={types}
        searchTerm={searchTerm}
        filterType={filterType}
        setSearchTerm={setSearchTerm}
        setFilterType={setFilterType}
      />

      {/* Hiển thị tài liệu */}
      {viewMode === "table" ? (
        <DocumentTableView
          documents={filteredDocuments}
          downloadingIds={downloadingIds}
          handleDownload={downloadDocument}
          handleDelete={removeDocument}
          checkRelation={checkRelations}
          checking={checking}
          deleting={deleting}
          relationInfo={relationInfo}
        />
      ) : (
        <DocumentSectionView
          documents={filteredDocuments}
          types={types}
          downloadingIds={downloadingIds}
          handleDownload={downloadDocument}
        />
      )}
    </Section>
  );
};

export default DocumentsTab;
