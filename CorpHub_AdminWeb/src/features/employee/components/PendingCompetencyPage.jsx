import React, { useEffect, useState } from "react";
import {
  Loader2,
  AlertCircle,
  FileText,
  User,
  Check,
  XCircle,
} from "lucide-react";
import { useAdminCompetencyEmployee } from "../hooks/useAdminCompetencyEmployee";
import { useDocument } from "../../profile/hooks/useDocument";
import RejectModal from "./RejectModal";
import AcceptButton from "../../global/components/button/AcceptButton";
import RejectButton from "../../global/components/button/RejectButton";

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("vi-VN") : "-");

export default function PendingCompetencyPage() {
  const { pendingCompetencies, loading, error, loadPending, approve, reject } =
    useAdminCompetencyEmployee();

  const { downloadDocument } = useDocument();

  // Modal state
  const [rejectTarget, setRejectTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // id đang lưu ngoài loading

  useEffect(() => {
    loadPending();
  }, [loadPending]);

  const handleApprove = async (id) => {
    setActionLoading(id);
    await approve(id);
    setActionLoading(null);
  };

  const handleReject = async (id, reason) => {
    setActionLoading(id);
    await reject(id, reason);
    setRejectTarget(null);
    setActionLoading(null);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Competency chờ duyệt</h1>
          <p className="text-gray-500 text-sm">
            Danh sách các chứng chỉ / năng lực nhân viên gửi lên, đang chờ Admin
            / HR duyệt.
          </p>
        </div>

        <button
          onClick={loadPending}
          className="px-3 py-2 rounded-xl border text-sm flex items-center gap-2 hover:bg-gray-50"
        >
          <Loader2
            size={16}
            className={loading ? "animate-spin" : "opacity-0"}
          />
          <span>Làm mới</span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-xl text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center my-8">
          <Loader2 className="animate-spin" size={28} />
        </div>
      )}

      {/* Empty state */}
      {!loading && pendingCompetencies?.length === 0 && (
        <div className="mt-6 border border-dashed border-gray-300 rounded-2xl p-6 text-center text-gray-500">
          Hiện chưa có competency nào đang chờ duyệt.
        </div>
      )}

      {/* Table */}
      {!loading && pendingCompetencies?.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-2xl overflow-hidden">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="p-2 border">Nhân viên</th>
                <th className="p-2 border">Tên competency</th>
                <th className="p-2 border">Loại</th>
                <th className="p-2 border">Cấp bởi</th>
                <th className="p-2 border">Ngày cấp</th>
                <th className="p-2 border">Tài liệu</th>
                <th className="p-2 border text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {pendingCompetencies.map((item) => {
                const isActionLoading = actionLoading === item.id;

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    {/* Nhân viên */}
                    <td className="p-2 border">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-full bg-gray-100">
                          <User size={16} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">
                            {item.employeeName ||
                              item.employeeFullName ||
                              "Không rõ"}
                          </div>
                          {item.employeeCode && (
                            <div className="text-xs text-gray-500">
                              Mã: {item.employeeCode}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Tên competency */}
                    <td className="p-2 border">
                      <div className="font-medium">{item.name}</div>
                      {item.levelName && (
                        <div className="text-xs text-gray-500">
                          Level: {item.levelName}
                        </div>
                      )}
                    </td>

                    <td className="p-2 border">
                      {item.type?.name || item.typeName || "-"}
                    </td>
                    <td className="p-2 border">{item.issuedBy || "-"}</td>
                    <td className="p-2 border">
                      {fmtDate(item.issuedDate || item.createdAt)}
                    </td>

                    {/* Tài liệu */}
                    <td className="p-2 border">
                      {item.documentId ? (
                        <button
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg border hover:bg-gray-50"
                          onClick={() => downloadDocument(item.documentId)}
                        >
                          <FileText size={14} />
                          Xem
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">Không có</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="p-2 border text-center">
                      <div className="flex justify-center gap-2">
                        <AcceptButton
                          onClick={() => handleApprove(item.id)}
                          loading={isActionLoading}
                        />
                        <RejectButton
                          onClick={() => setRejectTarget(item)}
                          loading={isActionLoading}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject Modal */}
      <RejectModal
        open={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        onSubmit={(reason) => handleReject(rejectTarget.id, reason)}
      />
    </div>
  );
}
