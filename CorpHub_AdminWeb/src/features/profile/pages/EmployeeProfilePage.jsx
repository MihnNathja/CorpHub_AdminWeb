import { useEffect, useState } from "react";
import { mockEmployee } from "../mockEmployee";
import ProfileHeader from "../components/ProfileHeader";
import OverviewTab from "../components/overview/OverviewTab";
import JobProfileTab from "../components/job/JobProfileTab";
import DocumentsTab from "../components/document/DocumentsTab";
import AccountSettingsTab from "../components/AccountSettingsTab";
import { useProfile } from "../hooks/useProfile";

const EmployeeProfilePage = () => {
  const [tab, setTab] = useState("Overview");

  const {
    profile,
    handleUploadAvatar,
    uploading,
    uploadSuccess,
    error,
    fetchBasicInfo,
  } = useProfile();

  // Fetch basic profile on mount
  useEffect(() => {
    fetchBasicInfo();
  }, []);

  // Use mock data when real profile is unavailable
  const currentProfile = mockEmployee;

  const toggleActive = () => {
    console.log("Gọi API kích hoạt / vô hiệu hóa tài khoản ở đây");
  };

  console.log("Profile loaded from database:", profile);

  // ================== Render Tab ==================
  const renderTab = () => {
    switch (tab) {
      case "Overview":
        return <OverviewTab profile={profile} />;
      case "Job profile":
        return <JobProfileTab profiles={profile} />;
      case "Documents":
        return <DocumentsTab profile={profile} />;
      case "Account settings":
        return <AccountSettingsTab profile={profile} />;
      default:
        return null;
    }
  };

  if (!profile) {
    return <p className="text-gray-500">Loading employee data...</p>;
  }
  // ================== Render Page ==================
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Employee info header */}
      <div className="space-y-2">
        <ProfileHeader
          profile={profile}
          toggleActive={toggleActive}
          onUploadAvatar={handleUploadAvatar}
        />

        {uploading && (
          <p className="text-sm text-gray-500">Uploading image...</p>
        )}
        {uploadSuccess && (
          <p className="text-green-600 text-sm">Avatar updated successfully!</p>
        )}
        {error && (
          <p className="text-red-500 text-sm">
            Error uploading image: {error.message || error}
          </p>
        )}
      </div>

      {/* Navigation tabs */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="flex border-b mb-4 overflow-x-auto">
          {["Overview", "Job profile", "Documents", "Account settings"].map(
            (t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 whitespace-nowrap ${
                  tab === t
                    ? "border-b-2 border-indigo-500 font-semibold text-indigo-600"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {t}
              </button>
            )
          )}
        </div>

        {/* Nội dung tab */}
        {renderTab()}
      </div>
    </div>
  );
};

export default EmployeeProfilePage;
