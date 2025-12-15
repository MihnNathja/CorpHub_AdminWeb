import React, { useEffect, useState } from "react";
import usePositionRequests from "../hooks/usePositionRequests";

export default function PositionRequestList({ employeeId, onView }) {
  const { items, loading, error, loadByEmployee } = usePositionRequests();
  const [localEmployeeId, setLocalEmployeeId] = useState(employeeId);

  useEffect(() => {
    setLocalEmployeeId(employeeId);
  }, [employeeId]);

  useEffect(() => {
    loadByEmployee(localEmployeeId);
  }, [localEmployeeId, loadByEmployee]);

  if (!employeeId) return null;

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold mb-3">Position Requests</h4>
      {loading ? (
        <div className="p-4">Loading...</div>
      ) : error ? (
        <div className="p-4 text-red-500">Failed to load data</div>
      ) : items?.length === 0 ? (
        <div className="p-4 italic text-gray-500">No requests</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 dark:text-gray-300">
                <th className="py-2">ID</th>
                <th className="py-2">Created at</th>
                <th className="py-2">Created by</th>
                <th className="py-2">Current position</th>
                <th className="py-2">Requested position</th>
                <th className="py-2">New department</th>
                <th className="py-2">Type</th>
                <th className="py-2">Effective date</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="py-2">
                    {r.id?.slice ? r.id.slice(0, 8) : r.id}
                  </td>
                  <td className="py-2">
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleString("en-US")
                      : "-"}
                  </td>
                  <td className="py-2">{r.createdByName || "-"}</td>
                  <td className="py-2">{r.oldPositionName || "-"}</td>
                  <td className="py-2">{r.newPositionName || "-"}</td>
                  <td className="py-2">{r.newDepartmentName || "-"}</td>
                  <td className="py-2">{r.type || "-"}</td>
                  <td className="py-2">
                    {r.effectDate
                      ? new Date(r.effectDate).toLocaleDateString("en-US")
                      : "-"}
                  </td>
                  <td className="py-2">{r.status || "-"}</td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onView && onView(r)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
