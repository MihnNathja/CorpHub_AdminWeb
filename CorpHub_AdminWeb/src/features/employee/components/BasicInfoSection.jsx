import React from "react";

const BasicInfoSection = ({
  profile,
  departments,
  handleChange,
  handleAvatarChange,
  previewAvatar,
}) => {
  return (
    <section className="p-6 border rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
        Thông tin cơ bản
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Avatar */}
        <div className="md:col-span-2">
          {previewAvatar && (
            <div className="mt-3">
              <img
                src={previewAvatar}
                alt="Avatar Preview"
                className="h-32 w-32 rounded-full object-cover border"
              />
            </div>
          )}
          <label className="block text-sm font-medium mb-2">Ảnh đại diện</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Họ và tên</label>
          <input
            type="text"
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ngày sinh</label>
          <input
            type="date"
            name="dob"
            value={profile.dob}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Giới tính</label>
          <select
            name="gender"
            value={profile.gender}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Chọn --</option>
            <option value="Male">Nam</option>
            <option value="Female">Nữ</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Số điện thoại
          </label>
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Email cá nhân
          </label>
          <input
            type="email"
            name="personalEmail"
            value={profile.personalEmail}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Phòng ban</label>
          <select
            name="departmentId"
            value={profile.departmentId}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Chọn phòng ban --</option>
            {departments?.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
};

export default BasicInfoSection;
