import React, { useState, useMemo } from "react";
import { useAbsenceBalance } from "../hooks/useAbsenceBalance";

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


    if (loading) return <p className="text-center py-6">Đang tải dữ liệu...</p>;
    if (!absenceBalances?.length)
        return <p className="text-center py-6 text-gray-500 dark:text-gray-400">Không có dữ liệu nghỉ phép.</p>;

    return (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-inner p-4">
            {/* ==== CHỌN KIỂU NHÓM ==== */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Bảng tổng hợp nghỉ phép
                </h2>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Nhóm theo:</span>
                    <select
                        value={groupBy}
                        onChange={(e) => setGroupBy(e.target.value)}
                        className="border rounded-lg px-2 py-1 bg-white dark:bg-gray-700 text-sm dark:text-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    >
                        <option value="user">Nhân viên</option>
                        <option value="type">Loại nghỉ</option>
                    </select>
                </div>
            </div>

            {/* ==== HIỂN THỊ DỮ LIỆU ==== */}
            {Object.values(grouped).map((group, idx) => (
                <div key={idx} className="mb-6 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    {/* HEADER NHÓM */}
                    <div className="bg-blue-100 dark:bg-blue-900/40 px-4 py-2 flex justify-between items-center">
                        <h3 className="font-semibold text-blue-800 dark:text-blue-300">
                            {groupBy === "user" ? `👤 ${group.label}` : `📘 ${group.label}`}
                        </h3>
                        {group.email && (
                            <span className="text-xs text-gray-600 dark:text-gray-400">{group.email}</span>
                        )}
                    </div>

                    {/* BẢNG CON */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
                            <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700/60 dark:text-gray-400">
                                <tr>
                                    {groupBy === "user" ? (
                                        <>
                                            <th className="px-4 py-2 w-[25%]">Loại nghỉ</th>
                                            <th className="px-4 py-2 text-center">Năm</th>
                                            <th className="px-4 py-2 text-center">Tổng phép</th>
                                            <th className="px-4 py-2 text-center">Đã dùng</th>
                                            <th className="px-4 py-2 text-center">Còn lại</th>
                                            <th className="px-4 py-2 text-center">Cộng dồn</th>
                                        </>
                                    ) : (
                                        <>
                                            <th className="px-4 py-2 w-[25%]">Nhân viên</th>
                                            <th className="px-4 py-2 text-center">Năm</th>
                                            <th className="px-4 py-2 text-center">Tổng phép</th>
                                            <th className="px-4 py-2 text-center">Đã dùng</th>
                                            <th className="px-4 py-2 text-center">Còn lại</th>
                                            <th className="px-4 py-2 text-center">Cộng dồn</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {group.items.map((b, i) => {
                                    const remaining = (b.totalDays ?? 0) - (b.usedDays ?? 0);
                                    return (
                                        <tr
                                            key={i}
                                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/70 transition"
                                        >
                                            {groupBy === "user" ? (
                                                <>
                                                    <td className="px-4 py-2 font-medium">{b.absenceType.name}</td>
                                                    <td className="px-4 py-2 text-center">{b.year}</td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="px-4 py-2 font-medium">{b.user.fullName}</td>
                                                    <td className="px-4 py-2 text-center">{b.year}</td>
                                                </>
                                            )}
                                            <td className="px-4 py-2 text-center">{b.totalDays}</td>
                                            <td className="px-4 py-2 text-center text-yellow-600 dark:text-yellow-400">
                                                {b.usedDays}
                                            </td>
                                            <td
                                                className={`px-4 py-2 text-center font-semibold ${remaining <= 0
                                                    ? "text-red-600 dark:text-red-400"
                                                    : "text-green-700 dark:text-green-400"
                                                    }`}
                                            >
                                                {remaining}
                                            </td>
                                            <td className="px-4 py-2 text-center">{b.carriedOver}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AbsenceBalanceTable;
