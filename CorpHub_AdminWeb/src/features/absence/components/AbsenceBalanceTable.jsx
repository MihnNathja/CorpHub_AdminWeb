import React, { useState, useMemo } from "react";
import { useAbsenceBalance } from "../hooks/useAbsenceBalance";
import { Users, FileText, BarChart3, Calendar, AlertCircle, Filter } from "lucide-react";

const AbsenceBalanceTable = () => {
    const { absenceBalances, loading } = useAbsenceBalance();
    const [groupBy, setGroupBy] = useState("user"); // "user" | "type"

    const grouped = useMemo(() => {
        if (!absenceBalances) return {};

        if (groupBy === "user") {
            return absenceBalances.reduce((acc, item) => {
                const userId = item.user?.id;
                if (!acc[userId])
                    acc[userId] = { key: userId, label: item.user?.fullName, email: item.user?.email, items: [] };
                acc[userId].items.push(item);
                return acc;
            }, {});
        } else {
            // ✅ Lấy đúng tên loại nghỉ
            return absenceBalances.reduce((acc, item) => {
                const typeId = item.absenceType?.id;
                const typeName = item.absenceType?.name;
                if (!acc[typeId]) acc[typeId] = { key: typeId, label: typeName, items: [] };
                acc[typeId].items.push(item);
                return acc;
            }, {});
        }
    }, [absenceBalances, groupBy]);

    if (loading)
        return (
            <div className="p-12 text-center">
                <div className="inline-block">
                    <div className="w-8 h-8 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-3">Loading absence balances...</p>
            </div>
        );

    if (!absenceBalances?.length)
        return (
            <div className="p-12 text-center">
                <AlertCircle className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    No absence data found
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    There are no absence balances to display.
                </p>
            </div>
        );

    return (
        <div className="space-y-6">
            {/* Header with Filter */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Absence Balance Summary
                    </h2>
                </div>

                <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2.5">
                    <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                        Group by:
                    </span>
                    <select
                        value={groupBy}
                        onChange={(e) => setGroupBy(e.target.value)}
                        className="bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none cursor-pointer"
                    >
                        <option value="user">👤 Employee</option>
                        <option value="type">📋 Absence Type</option>
                    </select>
                </div>
            </div>

            {/* Groups */}
            <div className="space-y-5">
                {Object.values(grouped).map((group, idx) => (
                    <div
                        key={idx}
                        className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow duration-200"
                    >
                        {/* Group Header */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                {groupBy === "user" ? (
                                    <div className="flex items-center gap-2">
                                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {group.label}
                                            </p>
                                            {group.email && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {group.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {group.label}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-2.5 py-1 rounded-full">
                                {group.items.length} record{group.items.length !== 1 ? "s" : ""}
                            </span>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 uppercase text-xs font-semibold border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        {groupBy === "user" ? (
                                            <>
                                                <th className="px-6 py-3 flex items-center gap-2">
                                                    <FileText className="w-4 h-4" />
                                                    Absence Type
                                                </th>
                                                <th className="px-6 py-3 text-center">
                                                    <Calendar className="w-4 h-4 inline mr-1" />
                                                    Year
                                                </th>
                                                <th className="px-6 py-3 text-center">Total Days</th>
                                                <th className="px-6 py-3 text-center">Used</th>
                                                <th className="px-6 py-3 text-center">Remaining</th>
                                                <th className="px-6 py-3 text-center">Carried Over</th>
                                            </>
                                        ) : (
                                            <>
                                                <th className="px-6 py-3 flex items-center gap-2">
                                                    <Users className="w-4 h-4" />
                                                    Employee
                                                </th>
                                                <th className="px-6 py-3 text-center">
                                                    <Calendar className="w-4 h-4 inline mr-1" />
                                                    Year
                                                </th>
                                                <th className="px-6 py-3 text-center">Total Days</th>
                                                <th className="px-6 py-3 text-center">Used</th>
                                                <th className="px-6 py-3 text-center">Remaining</th>
                                                <th className="px-6 py-3 text-center">Carried Over</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {group.items.map((b, i) => {
                                        const remaining = (b.totalDays ?? 0) - (b.usedDays ?? 0);
                                        const isLow = remaining <= 0;
                                        const isWarning = remaining > 0 && remaining <= 2;

                                        return (
                                            <tr
                                                key={i}
                                                className={`hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors duration-150 ${isLow ? "bg-red-50/30 dark:bg-red-900/10" : ""
                                                    }`}
                                            >
                                                {groupBy === "user" ? (
                                                    <>
                                                        <td className="px-6 py-3 font-medium text-gray-900 dark:text-gray-100">
                                                            {b.absenceType.name}
                                                        </td>
                                                        <td className="px-6 py-3 text-center text-gray-700 dark:text-gray-300">
                                                            {b.year}
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="px-6 py-3 font-medium text-gray-900 dark:text-gray-100">
                                                            {b.user.fullName}
                                                        </td>
                                                        <td className="px-6 py-3 text-center text-gray-700 dark:text-gray-300">
                                                            {b.year}
                                                        </td>
                                                    </>
                                                )}
                                                <td className="px-6 py-3 text-center font-semibold text-gray-900 dark:text-gray-100">
                                                    {b.totalDays}
                                                </td>
                                                <td className="px-6 py-3 text-center font-semibold text-amber-600 dark:text-amber-400">
                                                    {b.usedDays}
                                                </td>
                                                <td
                                                    className={`px-6 py-3 text-center font-bold ${isLow
                                                            ? "text-red-600 dark:text-red-400"
                                                            : isWarning
                                                                ? "text-orange-600 dark:text-orange-400"
                                                                : "text-emerald-600 dark:text-emerald-400"
                                                        }`}
                                                >
                                                    {remaining}
                                                </td>
                                                <td className="px-6 py-3 text-center text-gray-700 dark:text-gray-300">
                                                    {b.carriedOver}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AbsenceBalanceTable;
