import {
  FileText,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import { useState } from "react";

const fmt = (d) =>
  d
    ? new Date(d).toLocaleDateString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

const CompetencyTable = ({ items, onDownload, onDelete, onEdit }) => {
  const [openRow, setOpenRow] = useState(null);
  const toggleMenu = (id) => setOpenRow(openRow === id ? null : id);

  return (
    <div className="overflow-x-auto mt-3 relative">
      <table className="min-w-full text-sm border border-gray-200">
        <thead className="bg-gray-100">
          <tr className="text-left">
            <th className="p-2 border">Loại</th>
            <th className="p-2 border">Tên</th>
            <th className="p-2 border">Trình độ</th>
            <th className="p-2 border">Cấp bởi</th>
            <th className="p-2 border">Ngày cấp</th>
            <th className="p-2 border">Ngày hết hạn</th>
            <th className="p-2 border">Tài liệu</th>
            <th className="p-2 border">Ngày upload</th>
            <th className="p-2 border">Trạng thái</th>
            <th className="p-2 border">Người tải lên</th>
            <th className="p-2 border text-center">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {items?.length ? (
            items.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 even:bg-gray-50/50">
                <td className="p-2 border">{c.typeName || "-"}</td>
                <td className="p-2 border font-medium">{c.name || "-"}</td>
                <td className="p-2 border">{c.levelName || "-"}</td>
                <td className="p-2 border">{c.issuedBy || "-"}</td>
                <td className="p-2 border">{fmt(c.issuedDate)}</td>
                <td className="p-2 border">{fmt(c.expireDate)}</td>

                {/* 🔹 File đính kèm: giữ nguyên cách click vào tên để tải */}
                <td className="p-2 border text-blue-600">
                  {c.documentId ? (
                    <button
                      onClick={() => onDownload?.(c.documentId)}
                      className="flex items-center gap-1 hover:underline"
                    >
                      <FileText size={16} /> {c.fileName || "Tải xuống"}
                    </button>
                  ) : (
                    "-"
                  )}
                </td>

                <td className="p-2 border">{fmt(c.uploadDate)}</td>

                <td className="p-2 border">
                  <div className="flex items-center gap-1">
                    {c.verificationStatus === "VERIFIED" && (
                      <CheckCircle size={16} className="text-green-600" />
                    )}
                    {c.verificationStatus === "PENDING" && (
                      <Clock size={16} className="text-yellow-500" />
                    )}
                    {c.verificationStatus === "REJECTED" && (
                      <XCircle size={16} className="text-red-500" />
                    )}
                    <span
                      className={
                        c.verificationStatus === "VERIFIED"
                          ? "text-green-600"
                          : c.verificationStatus === "REJECTED"
                          ? "text-red-500"
                          : "text-yellow-600"
                      }
                    >
                      {c.verificationStatus || "PENDING"}
                    </span>
                    {c.verifyUrl && (
                      <a
                        href={c.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 ml-1"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </td>

                <td className="p-2 border">{c.uploadedByName || "-"}</td>

                {/* ⚙️ Menu thao tác */}
                <td className="p-2 border text-center relative">
                  <button
                    onClick={() => toggleMenu(c.id)}
                    className="p-1 rounded hover:bg-gray-100"
                    title="Thao tác"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {openRow === c.id && (
                    <div className="absolute right-2 top-8 bg-white border rounded-lg shadow-lg w-40 z-10">
                      <button
                        onClick={() => {
                          onEdit?.(c);
                          setOpenRow(null);
                        }}
                        className="flex items-center gap-2 px-3 py-2 w-full hover:bg-gray-50 text-left"
                      >
                        <Edit size={14} /> Chỉnh sửa
                      </button>

                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Bạn có chắc muốn xóa chứng chỉ "${c.name}" không?`
                            )
                          ) {
                            onDelete?.(c.id);
                          }
                          setOpenRow(null);
                        }}
                        className="flex items-center gap-2 px-3 py-2 w-full hover:bg-gray-50 text-left text-red-600"
                      >
                        <Trash2 size={14} /> Xóa
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="text-center p-4 text-gray-500">
                Chưa có chứng chỉ nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CompetencyTable;
