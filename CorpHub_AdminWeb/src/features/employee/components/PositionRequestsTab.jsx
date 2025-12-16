import React, { useEffect, useState } from "react";
import usePositionRequests from "../hooks/usePositionRequests";
import PositionRequestDetailModal from "./PositionRequestDetailModal";
import { showError } from "../../../utils/toastUtils";

const STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED", "CANCELLED"];

export default function PositionRequestsTab() {
  const { items, loading, error, loadAll, getDetail, getSteps } =
    usePositionRequests();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    // Load all requests initially (no filter)
    loadAll("");
  }, [loadAll]);

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    loadAll(status);
  };

  const handleViewDetail = async (request) => {
    try {
      const detail = await getDetail(request.id);
      const steps = await getSteps(request.id);
      setSelectedRequest({
        ...detail,
        approvalSteps: steps,
      });
    } catch (err) {
      showError("Unable to load request details");
      console.error(err);
    }
  };

  const handleApproveStep = async (approvalId, comment) => {
    // Implement in detail modal
    console.log("Approve:", approvalId, comment);
  };

  const handleRejectStep = async (approvalId, comment) => {
    // Implement in detail modal
    console.log("Reject:", approvalId, comment);
  };

  const handleRefresh = () => {
    loadAll(selectedStatus);
  };

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <span className="text-sm font-medium">Filter by status:</span>
        <button
          onClick={() => handleStatusFilter("")}
          className={`px-3 py-2 rounded text-sm font-medium transition ${
            selectedStatus === ""
              ? "bg-blue-600 text-white"
              : "bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200"
          }`}
        >
          All
        </button>
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            onClick={() => handleStatusFilter(status)}
            className={`px-3 py-2 rounded text-sm font-medium transition ${
              selectedStatus === status
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
        <button
          onClick={handleRefresh}
          className="ml-auto px-3 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700"
        >
          Refresh
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="p-6 text-center">Loading...</div>
      ) : error ? (
        <div className="p-6 text-center text-red-500">Failed to load data</div>
      ) : items?.length === 0 ? (
        <div className="p-6 text-center italic text-gray-500">No requests</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr className="text-left text-gray-700 dark:text-gray-200 font-semibold">
                <th className="px-4 py-3 border">ID</th>
                <th className="px-4 py-3 border">Employee</th>
                <th className="px-4 py-3 border">Created by</th>
                <th className="px-4 py-3 border">Created at</th>
                <th className="px-4 py-3 border">Current position</th>
                <th className="px-4 py-3 border">Requested position</th>
                <th className="px-4 py-3 border">New department</th>
                <th className="px-4 py-3 border">Type</th>
                <th className="px-4 py-3 border">Effective date</th>
                <th className="px-4 py-3 border">Status</th>
                <th className="px-4 py-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr
                  key={r.id}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-4 py-3 border text-xs">
                    {r.id?.slice(0, 8) || "-"}
                  </td>
                  <td className="px-4 py-3 border">{r.employeeName || "-"}</td>
                  <td className="px-4 py-3 border">{r.createdByName || "-"}</td>
                  <td className="px-4 py-3 border text-xs">
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleString("vi-VN")
                      : "-"}
                  </td>
                  <td className="px-4 py-3 border">
                    {r.oldPositionName || "-"}
                  </td>
                  <td className="px-4 py-3 border">
                    {r.newPositionName || "-"}
                  </td>
                  <td className="px-4 py-3 border">
                    {r.newDepartmentName || "-"}
                  </td>
                  <td className="px-4 py-3 border">{r.type || "-"}</td>
                  <td className="px-4 py-3 border text-xs">
                    {r.effectDate
                      ? new Date(r.effectDate).toLocaleDateString("vi-VN")
                      : "-"}
                  </td>
                  <td className="px-4 py-3 border">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        r.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : r.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : r.status === "REJECTED"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {r.status || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3 border">
                    <button
                      onClick={() => handleViewDetail(r)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium"
                    >
                      View details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selectedRequest && (
        <PositionRequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={handleApproveStep}
          onReject={handleRejectStep}
          onRefresh={handleRefresh}
        />
      )}
    </div>
  );
}
