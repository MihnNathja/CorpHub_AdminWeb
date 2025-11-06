import { useRef, useState } from "react";
import { Pencil, Lock, Unlock, QrCode } from "lucide-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import Badge from "./Badge";
import QRCode from "react-qr-code";

const ProfileHeader = ({ profile, toggleActive, onUploadAvatar }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(profile.avatarUrl);
  const [showQR, setShowQR] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
    if (onUploadAvatar) onUploadAvatar(file);
  };

  // Trạng thái công việc
  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return <Badge color="green">Đang làm việc</Badge>;
      case "ON_LEAVE":
        return <Badge color="yellow">Đang nghỉ phép</Badge>;
      case "ON_BUSINESS":
        return <Badge color="blue">Đang công tác</Badge>;
      case "INACTIVE":
        return <Badge color="red">Đã nghỉ việc</Badge>;
      default:
        return <Badge color="gray">Không xác định</Badge>;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl mb-6 shadow">
      {/* ========== THÔNG TIN HEADER ========== */}
      <div className="bg-white p-5 flex flex-col md:flex-row items-end md:items-center gap-6 rounded-t-2xl shadow-md">
        {/* Avatar */}
        <div className="relative group">
          <Zoom>
            <img
              src={preview}
              alt="avatar"
              className="w-32 h-32 rounded-2xl border-4 border-white object-cover shadow cursor-zoom-in"
            />
          </Zoom>
          <button
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-1 right-1 
             bg-white/80 hover:bg-white border border-gray-300 
             backdrop-blur-sm p-1.5 rounded-full text-gray-700 
             hover:text-gray-900 shadow-sm transition"
            title="Đổi ảnh đại diện"
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

        {/* Thông tin nhân viên */}
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
            Mã NV: <b>{profile.code}</b> • Vai trò:{" "}
            <b>{profile.user?.roleName}</b>
          </p>
          <div className="text-sm text-gray-600 flex flex-wrap gap-4 mt-1">
            <span>📧 {profile.personalEmail}</span>
            <span>📞 {profile.phone}</span>
          </div>
        </div>

        {/* Hành động */}
        <div className="flex items-center gap-2 mt-3 md:mt-0">
          <button
            onClick={() => setShowQR(!showQR)}
            className="px-3 py-2 border rounded-xl flex items-center gap-2 hover:bg-gray-50"
          >
            <QrCode className="w-4 h-4" /> QR
          </button>
          <button
            onClick={toggleActive}
            className={`px-3 py-2 border rounded-xl flex items-center gap-2 ${
              profile.active
                ? "hover:bg-red-50 text-red-600 border-red-200"
                : "hover:bg-green-50 text-green-600 border-green-200"
            }`}
          >
            {profile.active ? (
              <>
                <Lock className="w-4 h-4" /> Khóa
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4" /> Mở khóa
              </>
            )}
          </button>
          <button className="px-3 py-2 border rounded-xl flex items-center gap-2 hover:bg-gray-50">
            <Pencil className="w-4 h-4" /> Chỉnh sửa
          </button>
        </div>
      </div>

      {/* ========== QR CODE ========== */}
      {/* Sửa link bên dưới lại cho phù hợp với trang deploy */}
      {showQR && (
        <div className="absolute top-4 right-4 bg-white p-3 rounded-xl shadow border">
          <QRCode
            value={`https://corp.example.com/profile/${profile.id}`}
            size={100}
          />
          <p className="text-xs text-gray-500 text-center mt-2">
            Quét để mở hồ sơ
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
