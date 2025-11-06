import { Loader2, Download } from "lucide-react";

const DocumentTableView = ({ documents, downloadingIds, handleDownload }) => (
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
        {documents.length > 0 ? (
          documents.map((doc) => {
            const isDownloading = downloadingIds.includes(doc.id);
            return (
              <tr key={doc.id} className="hover:bg-gray-50 even:bg-gray-50/50">
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
            <td colSpan="5" className="text-center p-4 text-gray-500 italic">
              Chưa có tài liệu nào
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default DocumentTableView;
