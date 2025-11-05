import React from "react";

const dummyApprovals = [
    { approver: "Trần Thị B", action: "APPROVED", note: "Đã duyệt", createdAt: "2025-03-20" },
    { approver: "Nguyễn Văn C", action: "REJECTED", note: "Trùng lịch họp", createdAt: "2025-04-10" },
];

const LeaveApprovalTable = () => (
    <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
            <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
                <tr>
                    <th className="px-4 py-3">Approver</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Note</th>
                    <th className="px-4 py-3">Created At</th>
                </tr>
            </thead>
            <tbody>
                {dummyApprovals.map((a, idx) => (
                    <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <td className="px-4 py-2">{a.approver}</td>
                        <td className={`px-4 py-2 font-semibold ${a.action === "APPROVED" ? "text-green-500" : "text-red-500"}`}>
                            {a.action}
                        </td>
                        <td className="px-4 py-2">{a.note}</td>
                        <td className="px-4 py-2">{a.createdAt}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default LeaveApprovalTable;
