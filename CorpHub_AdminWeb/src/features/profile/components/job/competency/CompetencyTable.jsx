// src/features/profile/components/job/CompetencyTable.jsx
import {
  FileText,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

const fmt = (d) =>
  d
    ? new Date(d).toLocaleDateString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

const CompetencyTable = ({ items, onDownload }) => {
  return (
    <div className="overflow-x-auto mt-3">
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
          </tr>
        </thead>

        <tbody>
          {items?.length ? (
            items.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 even:bg-gray-50/50">
                {/* Loại */}
                <td className="p-2 border">{c.typeName || "-"}</td>

                {/* Tên chứng chỉ */}
                <td className="p-2 border font-medium text-gray-800">
                  {c.name || "-"}
                </td>

                {/* Trình độ */}
                <td className="p-2 border">{c.levelName || "-"}</td>

                {/* Cấp bởi */}
                <td className="p-2 border">{c.issuedBy || "-"}</td>

                {/* Ngày cấp + hết hạn */}
                <td className="p-2 border">{fmt(c.issuedDate)}</td>
                <td className="p-2 border">{fmt(c.expireDate)}</td>

                {/* File đính kèm */}
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

                {/* ✅ Ngày upload */}
                <td className="p-2 border text-gray-700">
                  {fmt(c.uploadDate)}
                </td>

                {/* Trạng thái xác minh */}
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

                {/* Người tải lên */}
                <td className="p-2 border">{c.uploadedByName || "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center p-4 text-gray-500">
                Chưa có năng lực hoặc chứng chỉ nào được ghi nhận
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CompetencyTable;
