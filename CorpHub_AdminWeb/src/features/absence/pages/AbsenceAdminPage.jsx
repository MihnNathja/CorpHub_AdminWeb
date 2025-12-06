import React, { useState, useMemo } from "react";
import AbsenceTypeTable from "../components/AbsenceTypeTable";
import AbsenceBalanceTable from "../components/AbsenceBalanceTable";
import HolidayCalendarTable from "../components/HolidayCalendarTable";
import AbsenceRequestTable from "../components/AbsenceRequestTableAdmin";
import { useAuth } from "../../auth/hooks/useAuth";
import { Calendar, Clock, BarChart3, Settings, Zap } from "lucide-react";

const AbsenceAdminPage = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const { hasRole } = useAuth();

  const isAdmin = hasRole("ROLE_ADMIN");

  const tabs = useMemo(() => {
    const baseTabs = [
      {
        key: "requests",
        label: "Absence Requests",
        icon: Clock,
        description: "Manage employee absence requests"
      },
      {
        key: "balances",
        label: "Absence Balances",
        icon: BarChart3,
        description: "View and manage absence balances"
      },
      {
        key: "holidays",
        label: "Holiday Calendar",
        icon: Calendar,
        description: "Manage company holidays"
      },
    ];

    if (isAdmin) {
      baseTabs.splice(1, 0, {
        key: "types",
        label: "Absence Types",
        icon: Settings,
        description: "Configure absence types and policies",
      });
    }

    return baseTabs;
  }, [isAdmin]);

  const currentTab = tabs.find((t) => t.key === activeTab);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl p-6 shadow-lg border border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-sm">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-white/80 uppercase tracking-wide">Management</p>
            <h1 className="text-3xl font-bold">Absence Management</h1>
          </div>
        </div>
        <p className="text-sm text-white/70 mt-2 ml-13">
          Manage absence requests, balances, and holiday calendars
        </p>
      </div>

      {/* Tabs Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-200 border-b-2 text-sm whitespace-nowrap ${isActive
                    ? "text-blue-600 dark:text-blue-400 border-b-blue-600 dark:border-b-blue-400 bg-blue-50/40 dark:bg-blue-900/20"
                    : "text-gray-600 dark:text-gray-400 border-b-transparent hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Description */}
        {currentTab && (
          <div className="px-6 py-3 bg-blue-50/50 dark:bg-blue-900/10 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            {currentTab.description}
          </div>
        )}

        {/* Tab Content */}
        <div className="p-6 animate-fade-in">
          {activeTab === "requests" && <AbsenceRequestTable />}
          {activeTab === "types" && isAdmin && <AbsenceTypeTable />}
          {activeTab === "balances" && <AbsenceBalanceTable />}
          {activeTab === "holidays" && <HolidayCalendarTable />}
        </div>
      </div>
    </div>
  );
};

export default AbsenceAdminPage;
