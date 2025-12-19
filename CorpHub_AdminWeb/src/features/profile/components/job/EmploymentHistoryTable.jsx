import { Eye } from "lucide-react";

const fmt = (d) => (d ? new Date(d).toLocaleDateString("vi-VN") : "-");

const ChangeTypeBadge = ({ changeType }) => {
  const colors = {
    PROMOTION:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    TRANSFER:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    DEMOTION:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    OTHER: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300",
  };

  const labels = {
    PROMOTION: "Promotion",
    TRANSFER: "Transfer",
    DEMOTION: "Demotion",
    OTHER: "Other",
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded-full font-medium ${
        colors[changeType] || colors.OTHER
      }`}
    >
      {labels[changeType] || changeType || "-"}
    </span>
  );
};

const EmploymentHistoryTable = ({ histories, onViewRequest }) => {
  return (
    <div className="overflow-x-auto mt-3">
      <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr className="text-left">
            <th className="p-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300">
              Department
            </th>
            <th className="p-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300">
              Position
            </th>
            <th className="p-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300">
              Change type
            </th>
            <th className="p-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300">
              Effective date
            </th>
            <th className="p-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300">
              Reason
            </th>
            <th className="p-3 border border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300 text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {!histories?.length ? (
            <tr>
              <td
                colSpan="6"
                className="text-center p-8 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
              >
                No work history available
              </td>
            </tr>
          ) : (
            histories.map((history) => (
              <tr
                key={history.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 even:bg-gray-50/50 dark:even:bg-gray-800/30"
              >
                <td className="p-3 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                  {history.departmentName || "-"}
                </td>
                <td className="p-3 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                  {history.positionName || "-"}
                </td>
                <td className="p-3 border border-gray-200 dark:border-gray-700">
                  <ChangeTypeBadge changeType={history.changeType} />
                </td>
                <td className="p-3 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                  {fmt(history.effectiveDate)}
                </td>
                <td className="p-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 max-w-xs truncate">
                  {history.reason || "-"}
                </td>
                <td className="p-3 border border-gray-200 dark:border-gray-700 text-center">
                  {history.requestId ? (
                    <button
                      onClick={() =>
                        onViewRequest && onViewRequest(history.requestId)
                      }
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                      title="Xem yêu cầu"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View request
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400 dark:text-gray-600">
                      -
                    </span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmploymentHistoryTable;
