import { useRef } from "react";
import { Upload } from "lucide-react";
import Section from "./Section";

const DocumentsTab = ({ profile, onUploadDocuments }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0 && onUploadDocuments) {
      onUploadDocuments(files);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <Section
      title="Tài liệu nhân sự"
      right={
        <button
          onClick={handleClickUpload}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border rounded-xl hover:bg-gray-50"
        >
          <Upload size={16} />
          Tải lên
        </button>
      }
    >
      <input
        type="file"
        ref={fileInputRef}
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="divide-y">
        {profile.documents?.length > 0 ? (
          profile.documents.map((doc, idx) => (
            <div key={idx} className="flex items-center justify-between py-3">
              <div>
                <div className="text-sm font-medium">{doc.name}</div>
                <div className="text-xs text-gray-500">{doc.size}</div>
              </div>
              <button className="px-3 py-1.5 border rounded-xl text-sm hover:bg-gray-50">
                Tải xuống
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 py-3">
            Chưa có tài liệu nào được tải lên
          </p>
        )}
      </div>
    </Section>
  );
};

export default DocumentsTab;
