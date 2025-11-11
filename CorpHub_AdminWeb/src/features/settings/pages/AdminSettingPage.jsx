import { useState } from "react";
import { Settings, ListChecks, DatabaseBackup } from "lucide-react";
import BackupRestorePage from "./BackupRestorePage";
import ParameterConfigPage from "./ParameterConfigPage";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("parameters");

  return (
    <div className="p-6 space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-2">
        <Settings size={22} className="text-gray-700" />
        <h1 className="text-2xl font-semibold">Cài đặt hệ thống</h1>
      </div>

      {/* ===== Tabs Menu ===== */}
      <div className="flex gap-2 border-b pb-2">
        <button
          onClick={() => setActiveTab("parameters")}
          className={`flex items-center gap-2 px-3 py-2 rounded-t-md border-b-2 transition-all ${
            activeTab === "parameters"
              ? "border-blue-500 text-blue-600 font-semibold"
              : "border-transparent text-gray-600 hover:text-blue-500"
          }`}
        >
          <ListChecks size={16} /> Cấu hình tham số
        </button>

        <button
          onClick={() => setActiveTab("backup")}
          className={`flex items-center gap-2 px-3 py-2 rounded-t-md border-b-2 transition-all ${
            activeTab === "backup"
              ? "border-blue-500 text-blue-600 font-semibold"
              : "border-transparent text-gray-600 hover:text-blue-500"
          }`}
        >
          <DatabaseBackup size={16} /> Sao lưu & khôi phục
        </button>
      </div>

      {/* ===== Tab Content ===== */}
      <div className="mt-4">
        {activeTab === "parameters" && <ParameterConfigPage />}
        {activeTab === "backup" && <BackupRestorePage />}
      </div>
    </div>
  );
}
