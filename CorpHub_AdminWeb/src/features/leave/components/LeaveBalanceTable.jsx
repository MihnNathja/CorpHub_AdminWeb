import React from "react";
import { useLeaveBalance } from "../hooks/useLeaveBalance";

const LeaveBalanceTable = () => {
    const { leaveBalances } = useLeaveBalance();
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
                <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-800 dark:text-gray-400">
                    <tr>
                        <th className="px-4 py-3">User</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Year</th>
                        <th className="px-4 py-3">Total</th>
                        <th className="px-4 py-3">Used</th>
                        <th className="px-4 py-3">Carried Over</th>
                    </tr>
                </thead>
                <tbody>
                    {leaveBalances.map((b, idx) => (
                        <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                            <td className="px-4 py-2">{b.user.fullName}</td>
                            <td className="px-4 py-2">{b.leaveTypeName}</td>
                            <td className="px-4 py-2">{b.year}</td>
                            <td className="px-4 py-2">{b.totalDays}</td>
                            <td className="px-4 py-2">{b.usedDays}</td>
                            <td className="px-4 py-2">{b.carriedOver}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LeaveBalanceTable;
