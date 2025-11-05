import { useRef, useState } from "react";
import { Pencil, Lock, Unlock } from "lucide-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import Badge from "./Badge";

const ProfileHeader = ({ profile, toggleActive, onUploadAvatar }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(profile.avatarUrl);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    if (onUploadAvatar) onUploadAvatar(file);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl mb-6">
      {/* Header background */}
      <div className="h-16 bg-gradient-to-r from-slate-600 to-slate-500" />

      <div className="bg-white p-4 flex items-end gap-4 -mt-16 rounded-t-2xl shadow">
        {/* Avatar */}
        <div className="relative group">
          <Zoom>
            <img
              src={preview}
              alt="avatar"
              className="w-28 h-28 rounded-2xl border-4 border-white object-cover cursor-zoom-in"
            />
          </Zoom>

          <button
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-1 right-1 
             bg-white/70 hover:bg-white/90 
             border border-gray-300 backdrop-blur-sm 
             p-1.5 rounded-full text-gray-700 hover:text-gray-900 
             shadow-sm transition"
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

        {/* Info */}
        <div className="flex-1 p-2">
          <h1 className="text-2xl font-bold text-gray-900">
            {profile.fullName}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <Badge color="blue">{profile.position}</Badge>
            <Badge color="yellow">{profile.departmentName}</Badge>
            <Badge color={profile.active ? "green" : "red"}>
              {profile.active ? "Đang hoạt động" : "Đã khóa"}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Mã NV: {profile.code} • Vai trò: {profile.user.roleName}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="px-3 py-2 border rounded-xl flex items-center gap-2 hover:bg-gray-50">
            <Pencil className="w-4 h-4" /> Chỉnh sửa
          </button>
          {/* <button
            onClick={toggleActive}
            className={`px-3 py-2 rounded-xl flex items-center gap-2 ${
              profile.active
                ? "border text-red-600 hover:bg-red-50"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {profile.active ? (
              <Lock className="w-4 h-4" />
            ) : (
              <Unlock className="w-4 h-4" />
            )}
            {profile.active ? "Khóa" : "Mở"}
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
