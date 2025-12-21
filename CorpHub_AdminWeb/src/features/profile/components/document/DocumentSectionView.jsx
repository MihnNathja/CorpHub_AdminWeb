import { useState } from "react";
import { ChevronDown, ChevronRight, Loader2, Download } from "lucide-react";

const DocumentSectionView = ({
  documents,
  types,
  downloadingIds,
  handleDownload,
}) => {
  const grouped = types.map((t) => ({
    type: t,
    items: documents.filter((d) => d.documentTypeName === t.name),
  }));

  // Mở sẵn tất cả nhóm khi render lần đầu
  const [expanded, setExpanded] = useState(() =>
    types.reduce((acc, t) => ({ ...acc, [t.id]: true }), {})
  );

  return (
    <div className="mt-5 space-y-3">
      {grouped.map(({ type, items }) => (
        <div key={type.id} className="border rounded-xl overflow-hidden">
          <button
            onClick={() =>
              setExpanded((p) => ({ ...p, [type.id]: !p[type.id] }))
            }
            className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 transition"
          >
            <span className="font-medium text-sm">{type.name}</span>
            {expanded[type.id] ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>

          {expanded[type.id] && (
            <div className="divide-y">
              {items.length > 0 ? (
                items.map((doc) => {
                  const isDownloading = downloadingIds.includes(doc.id);
                  return (
                    <div
                      key={doc.id}
                      className="flex justify-between items-center px-4 py-2"
                    >
                      <div>
                        <div className="font-medium text-sm">{doc.title}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(doc.uploadDate).toLocaleDateString("vi-VN")}{" "}
                          – {doc.description || "No notes"}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(doc.id)}
                        disabled={isDownloading}
                        className={`flex items-center gap-1 text-blue-600 ${
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
                    </div>
                  );
                })
              ) : (
                <div className="p-3 text-sm text-gray-500 italic text-center">
                  Không có tài liệu nào trong mục này
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DocumentSectionView;
