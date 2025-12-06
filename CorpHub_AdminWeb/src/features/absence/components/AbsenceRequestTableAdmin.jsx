import React, { useState, useMemo } from "react";
import { useAbsenceRequest } from "../hooks/useAdminAbsenceRequest";
import { useAuth } from "../../auth/hooks/useAuth";
import AbsenceRequestCard from "./AbsenceRequestCard";
import { AlertCircle, Search, Clock, CheckCircle, XCircle, Clock3 } from "lucide-react";

const AbsenceRequestTable = () => {
    const { absenceRequests, approveRequest, rejectRequest, loading, error } = useAbsenceRequest();
    const { user } = useAuth();

    const [searchKeyword, setSearchKeyword] = useState("");
    const [activeTab, setActiveTab] = useState("all"); // "all" | "pending" | "approved" | "rejected"

    // Filter requests by status
    const filteredByStatus = useMemo(() => {
        switch (activeTab) {
            case "pending":
                return absenceRequests.filter((item) => item.status === "PENDING");
            case "approved":
                return absenceRequests.filter((item) => item.status === "APPROVED");
            case "rejected":
                return absenceRequests.filter((item) => item.status === "REJECTED");
            default:
                return absenceRequests;
        }
    }, [absenceRequests, activeTab]);

    // Filter by search keyword
    const filteredRequests = useMemo(() => {
        return filteredByStatus.filter((item) => {
            const matchesSearch = !searchKeyword ||
                item.user?.fullName?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                item.absenceType?.name?.toLowerCase().includes(searchKeyword.toLowerCase());

            return matchesSearch;
        });
    }, [filteredByStatus, searchKeyword]);

    // Count by status
    const statusCounts = useMemo(() => {
        return {
            all: absenceRequests.length,
            pending: absenceRequests.filter((item) => item.status === "PENDING").length,
            approved: absenceRequests.filter((item) => item.status === "APPROVED").length,
            rejected: absenceRequests.filter((item) => item.status === "REJECTED").length,
        };
    }, [absenceRequests]);

    const tabs = [
        {
            key: "all",
            label: "All Requests",
            icon: Clock,
            count: statusCounts.all,
            color: "blue",
        },
        {
            key: "pending",
            label: "Pending",
            icon: Clock3,
            count: statusCounts.pending,
            color: "amber",
        },
        {
            key: "approved",
            label: "Approved",
            icon: CheckCircle,
            count: statusCounts.approved,
            color: "emerald",
        },
        {
            key: "rejected",
            label: "Rejected",
            icon: XCircle,
            count: statusCounts.rejected,
            color: "rose",
        },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
                <div className="inline-block">
                    <div className="w-10 h-10 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">Đang tải đơn nghỉ...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-1">
                            Lỗi khi tải dữ liệu
                        </h3>
                        <p className="text-red-800 dark:text-red-200 text-sm">
                            {error.message || "Không thể tải danh sách đơn nghỉ. Vui lòng thử lại."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Absence Requests
                </h2>
            </div>

            {/* Tabs Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.key;
                        const colorClasses = {
                            blue: isActive ? "text-blue-600 dark:text-blue-400 border-b-blue-600 dark:border-b-blue-400 bg-blue-50/40 dark:bg-blue-900/20" : "text-gray-600 dark:text-gray-400 border-b-transparent hover:text-gray-900 dark:hover:text-gray-200",
                            amber: isActive ? "text-amber-600 dark:text-amber-400 border-b-amber-600 dark:border-b-amber-400 bg-amber-50/40 dark:bg-amber-900/20" : "text-gray-600 dark:text-gray-400 border-b-transparent hover:text-gray-900 dark:hover:text-gray-200",
                            emerald: isActive ? "text-emerald-600 dark:text-emerald-400 border-b-emerald-600 dark:border-b-emerald-400 bg-emerald-50/40 dark:bg-emerald-900/20" : "text-gray-600 dark:text-gray-400 border-b-transparent hover:text-gray-900 dark:hover:text-gray-200",
                            rose: isActive ? "text-rose-600 dark:text-rose-400 border-b-rose-600 dark:border-b-rose-400 bg-rose-50/40 dark:bg-rose-900/20" : "text-gray-600 dark:text-gray-400 border-b-transparent hover:text-gray-900 dark:hover:text-gray-200",
                        };

                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-200 border-b-2 text-sm whitespace-nowrap ${colorClasses[tab.color]}`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                                <span className="ml-auto px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Search Bar */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                    <div className="relative">
                        <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search by name, absence type..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className="w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                        />
                    </div>
                </div>

                {/* Results count */}
                {filteredRequests.length > 0 && (
                    <div className="px-6 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            Showing <span className="font-semibold text-gray-900 dark:text-gray-100">{filteredRequests.length}</span> request{filteredRequests.length !== 1 ? "s" : ""}
                            {searchKeyword ? " (filtered)" : ""}
                        </p>
                    </div>
                )}

                {/* Empty state */}
                {filteredRequests.length === 0 && (
                    <div className="p-12 text-center">
                        <AlertCircle className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                        <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                            {searchKeyword ? "No requests found" : "No absence requests"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {searchKeyword
                                ? "Try adjusting your search."
                                : "There are no absence requests in this category."}
                        </p>
                    </div>
                )}

                {/* Request Cards */}
                {filteredRequests.length > 0 && (
                    <div className="px-6 py-4 space-y-3">
                        {filteredRequests.map((item) => (
                            <AbsenceRequestCard
                                key={item.id}
                                item={item}
                                currentUserId={user.id}
                                approveRequest={approveRequest}
                                rejectRequest={rejectRequest}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AbsenceRequestTable;