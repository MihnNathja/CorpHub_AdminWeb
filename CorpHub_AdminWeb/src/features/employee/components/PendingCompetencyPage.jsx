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

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-US") : "-");

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
          <h1 className="text-2xl font-semibold">Pending competencies</h1>
          <p className="text-gray-500 text-sm">
            Employee-submitted certificates/competencies awaiting Admin/HR
            approval.
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
          <span>Refresh</span>
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
          There are currently no pending competencies.
        </div>
      )}

      {/* Table */}
      {!loading && pendingCompetencies?.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200 rounded-2xl overflow-hidden">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="p-2 border">Employee</th>
                <th className="p-2 border">Competency name</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Issued by</th>
                <th className="p-2 border">Issued date</th>
                <th className="p-2 border">Document</th>
                <th className="p-2 border text-center">Actions</th>
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
                        <div className="space-y-0.5">
                          {/* Tên nhân viên */}
                          <div className="font-medium text-gray-800">
                            {item.employeeName || "Unknown"}
                          </div>

                          {/* Mã nhân viên */}
                          <div className="text-xs text-gray-500">
                            Code: {item.employeeCode || "—"}
                          </div>

                          {/* Phòng ban */}
                          <div className="text-xs text-blue-600">
                            {item.departmentName || "No department"}
                          </div>
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
                          View
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">None</span>
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
