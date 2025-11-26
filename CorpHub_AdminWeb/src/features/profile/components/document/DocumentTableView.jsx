import { Loader2, Download, Trash2 } from "lucide-react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useState } from "react";
import DocumentDeleteDialog from "./DocumentDeletingDialog";

const DocumentTableView = ({
  documents,
  downloadingIds,
  handleDownload,
  checkRelation,
  relationInfo,
  handleDelete,
  deleting,
  checking,
}) => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDelete = (doc) => {
    setSelectedDoc(doc);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedDoc(null);
  };

  return (
    <div className="mt-5 border rounded-xl overflow-hidden relative">
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
          {documents.length > 0 ? (
            documents.map((doc) => {
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
                    <div className="flex justify-center gap-2">
                      <button
                        data-tooltip-id="doc-tip"
                        data-tooltip-content="Tải xuống"
                        onClick={() => handleDownload(doc.id)}
                        disabled={isDownloading}
                        className={`p-2 rounded-full transition-all ${
                          isDownloading
                            ? "opacity-50 cursor-not-allowed"
                            : "text-gray-500 hover:text-blue-600 hover:scale-110"
                        }`}
                      >
                        {isDownloading ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Download size={16} />
                        )}
                      </button>

                      <button
                        data-tooltip-id="doc-tip"
                        data-tooltip-content="Xóa tài liệu"
                        onClick={() => handleOpenDelete(doc)}
                        className="p-2 rounded-full text-gray-500 hover:text-red-600 hover:scale-110 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-4 text-gray-500 italic">
                Chưa có tài liệu nào
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Tooltip
        id="doc-tip"
        place="top"
        className="!bg-gray-800 !text-white !px-2 !py-1 !rounded-lg !text-xs"
        opacity={1}
      />

      {/* Modal xóa tài liệu */}
      <DocumentDeleteDialog
        open={openDialog}
        onClose={handleClose}
        document={selectedDoc}
        checkRelation={checkRelation}
        relationInfo={relationInfo}
        checking={checking}
        deleting={deleting}
        onDelete={(id) => {
          handleDelete(id);
          handleClose();
        }}
      />
    </div>
  );
};

export default DocumentTableView;
