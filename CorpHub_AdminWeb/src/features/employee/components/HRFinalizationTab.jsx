import React, { useEffect, useState } from "react";
import useFinalization from "../hooks/useFinalization";
import HRUploadDecisionPanel from "./HRUploadDecisionPanel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { showError } from "../../../utils/toastUtils";

const ITEMS_PER_PAGE = 10;

export default function HRFinalizationTab() {
  const {
    items,
    loading,
    error,
    uploading,
    uploadProgress,
    loadFinalizationRequests,
    upload,
  } = useFinalization();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadFinalizationRequests();
  }, [loadFinalizationRequests]);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const displayItems = items.slice(startIdx, endIdx);

  const handleViewDetail = async (request) => {
    setSelectedRequest(request);
  };

  const handleUploadSuccess = async (requestId, files, notes) => {
    try {
      await upload(requestId, files, notes);
      // Refresh list
      setCurrentPage(1);
      await loadFinalizationRequests();
    } catch (err) {
      showError("Upload failed");
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Finalize title change decisions
        </h3>
        <button
          onClick={loadFinalizationRequests}
          disabled={loading}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded text-sm font-medium"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="p-6 text-center text-gray-500">
          Loading requests...
        </div>
      ) : error ? (
        <div className="p-6 text-center text-red-500">Failed to load data</div>
      ) : items.length === 0 ? (
        <div className="p-6 text-center italic text-gray-500">
          No requests to finalize
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr className="text-left text-gray-700 dark:text-gray-200 font-semibold">
                <th className="px-4 py-3 border">ID</th>
                <th className="px-4 py-3 border">Employee</th>
                <th className="px-4 py-3 border">Old → new position</th>
                <th className="px-4 py-3 border">New department</th>
                <th className="px-4 py-3 border">Effective date</th>
                <th className="px-4 py-3 border">Approved by</th>
                <th className="px-4 py-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayItems.map((req) => (
                <tr
                  key={req.id}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-4 py-3 border text-xs">
                    {req.id?.slice(0, 8) || "-"}
                  </td>
                  <td className="px-4 py-3 border">
                    {req.employeeName || "-"}
                  </td>
                  <td className="px-4 py-3 border">
                    <div className="text-xs">
                      <p>{req.oldPositionName || "-"}</p>
                      <p className="text-green-600 font-medium">
                        ↓ {req.newPositionName || "-"}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 border">
                    {req.newDepartmentName || "-"}
                  </td>
                  <td className="px-4 py-3 border text-xs">
                    {req.effectDate
                      ? new Date(req.effectDate).toLocaleDateString("en-US")
                      : "-"}
                  </td>
                  <td className="px-4 py-3 border text-xs">
                    {req.approvalSteps?.length > 0 ? (
                      <div className="space-y-1">
                        {req.approvalSteps
                          .filter((s) => s.decision === "APPROVED")
                          .map((s) => (
                            <span
                              key={s.id}
                              className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs mr-1 mb-1"
                            >
                              ✓ {s.role}
                            </span>
                          ))}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-3 border">
                    <button
                      onClick={() => handleViewDetail(req)}
                      disabled={uploading}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded text-xs font-medium"
                    >
                      Upload
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {items.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Showing {startIdx + 1}-{Math.min(endIdx, items.length)} of {items.length}
            {" "}requests
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 rounded"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 rounded"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Upload Panel */}
      {selectedRequest && (
        <HRUploadDecisionPanel
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUploadSuccess={handleUploadSuccess}
          uploading={uploading}
          uploadProgress={uploadProgress}
        />
      )}
    </div>
  );
}
