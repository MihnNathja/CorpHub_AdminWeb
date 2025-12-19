import { useEffect, useRef, useState } from "react";
import { Pencil, Lock, Unlock } from "lucide-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import Badge from "./Badge";
import defaultAvatar from "../../../assets/defaultAvatar.jpg";

const ProfileHeader = ({ profile, toggleActive, onUploadAvatar }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(profile?.avatarUrl || defaultAvatar);

  useEffect(() => {
    setPreview(profile?.avatarUrl || defaultAvatar);
  }, [profile?.avatarUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
    if (onUploadAvatar) onUploadAvatar(file);
  };

  const handleImgError = () => {
    if (preview !== defaultAvatar) setPreview(defaultAvatar);
  };

  // Employment status badges
  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return <Badge color="green">Working</Badge>;
      case "ON_LEAVE":
        return <Badge color="yellow">On leave</Badge>;
      case "ON_BUSINESS":
        return <Badge color="blue">On business trip</Badge>;
      case "INACTIVE":
        return <Badge color="red">Inactive</Badge>;
      default:
        return <Badge color="gray">Unknown</Badge>;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl mb-6 shadow">
      {/* ========== HEADER INFO ========== */}
      <div className="bg-white p-5 flex flex-col md:flex-row items-end md:items-center gap-6 rounded-t-2xl shadow-md">
        {/* Avatar */}
        <div className="relative group">
          <Zoom>
            <img
              src={preview || defaultAvatar}
              alt="avatar"
              onError={handleImgError}
              className="w-32 h-32 rounded-2xl border-4 border-white object-cover shadow cursor-zoom-in"
            />
          </Zoom>
          <button
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-1 right-1 
             bg-white/80 hover:bg-white border border-gray-300 
             backdrop-blur-sm p-1.5 rounded-full text-gray-700 
             hover:text-gray-900 shadow-sm transition"
            title="Change avatar"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Employee info */}
        <div className="flex-1 space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">
            {profile.fullName}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge color="blue">{profile.positionName}</Badge>
            <Badge color="yellow">{profile.departmentName}</Badge>
            {getStatusBadge(profile.status)}
          </div>
          <p className="text-sm text-gray-500">
            Employee code: <b>{profile.code}</b> • Role:{" "}
            <b>{profile.user?.roleName}</b>
          </p>
          <div className="text-sm text-gray-600 flex flex-wrap gap-4 mt-1">
            <span>📧 {profile.personalEmail}</span>
            <span>📞 {profile.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
