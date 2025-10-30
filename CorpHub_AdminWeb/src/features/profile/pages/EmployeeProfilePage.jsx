import { useState } from "react";
import { mockEmployee } from "../mockEmployee";
import ProfileHeader from "../components/ProfileHeader";
import OverviewTab from "../components/OverviewTab";
import JobProfileTab from "../components/JobProfileTab";
import DocumentsTab from "../components/DocumentsTab";
import AccountSettingsTab from "../components/AccountSettingsTab";
import { useProfile } from "../hooks/useProfile";

const EmployeeProfilePage = () => {
  const [profile, setProfile] = useState(mockEmployee);
  const [tab, setTab] = useState("Tổng quan");

  const toggleActive = () => setProfile((p) => ({ ...p, active: !p.active }));

  const { handleUploadAvatar, uploading, uploadSuccess, error } = useProfile();

  const renderTab = () => {
    switch (tab) {
      case "Tổng quan":
        return <OverviewTab profile={profile} />;
      case "Hồ sơ công việc":
        return <JobProfileTab profile={profile} />;
      case "Tài liệu":
        return <DocumentsTab profile={profile} />;
      case "Cài đặt tài khoản":
        return <AccountSettingsTab profile={profile} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="p-6 space-y-6">
        <ProfileHeader
          profile={profile}
          toggleActive={toggleActive}
          onUploadAvatar={handleUploadAvatar}
        />

        {uploading && (
          <p className="text-sm text-gray-500">Đang tải ảnh lên...</p>
        )}
        {uploadSuccess && (
          <p className="text-green-600 text-sm">Cập nhật ảnh thành công!</p>
        )}
        {error && (
          <p className="text-red-500 text-sm">
            Lỗi khi tải ảnh: {error.message || error}
          </p>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="flex border-b mb-4">
          {[
            "Tổng quan",
            "Hồ sơ công việc",
            "Tài liệu",
            "Cài đặt tài khoản",
          ].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 ${
                tab === t
                  ? "border-b-2 border-indigo-500 font-semibold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {renderTab()}
      </div>
    </div>
  );
};

export default EmployeeProfilePage;
