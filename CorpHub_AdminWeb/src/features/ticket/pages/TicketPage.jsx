import React, { useMemo, useState } from "react";
import TicketSentTable from "../components/sent/TicketSentTable";
import TicketReceivedTable from "../components/received/TicketReceivedTable";
import { usePermission } from "../../../hooks/usePermission";
import { useAuth } from "../../auth/hooks/useAuth";
import TicketAccountRequestTable from "../components/TicketAccountRequestTable";
import { Send, Inbox, UserCheck, Zap } from "lucide-react";

const TicketsPage = () => {
  const [activeTab, setActiveTab] = useState("sent");
  const { canViewAccountRequests } = usePermission();
  const { user } = useAuth();

  // ✅ Cấu hình tabs động với icons
  const tabs = useMemo(() => {
    const baseTabs = [
      {
        key: "sent",
        label: "My Tickets Sent",
        icon: Send,
        description: "Tickets created by my department",
      },
      {
        key: "received",
        label: "My Tickets Received",
        icon: Inbox,
        description: "Tickets received by my department",
      },
    ];

    // Nếu là IT, thêm tab "Account Requests"
    if (canViewAccountRequests) {
      baseTabs.push({
        key: "account_request",
        label: "Account Requests",
        icon: UserCheck,
        description: "Manage user account requests",
      });
    }

    return baseTabs;
  }, [canViewAccountRequests, user]);

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
            <h1 className="text-3xl font-bold">Tickets Management</h1>
          </div>
        </div>
        <p className="text-sm text-white/70 mt-2 ml-13">
          Manage and track all tickets across your organization
        </p>
      </div>

      {/* Tabs Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 px-6 py-4 font-medium transition-all duration-200 flex items-center justify-center gap-2 text-sm border-b-2 ${isActive
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
          {activeTab === "sent" && <TicketSentTable />}
          {activeTab === "received" && <TicketReceivedTable />}
          {activeTab === "account_request" && <TicketAccountRequestTable />}
        </div>
      </div>
    </div>
  );
};

export default TicketsPage;
