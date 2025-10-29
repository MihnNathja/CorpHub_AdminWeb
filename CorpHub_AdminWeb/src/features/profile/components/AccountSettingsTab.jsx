// src/features/employee/components/AccountSettingsTab.jsx
import { useState } from "react";
import {
  ShieldCheck,
  Bell,
  Mail,
  Phone,
  KeyRound,
  ToggleRight,
} from "lucide-react";
import Section from "./Section";

const AccountSettingsTab = ({ profile }) => {
  const [settings, setSettings] = useState({
    email: profile.email,
    phone: profile.phone,
    twoFactor: true,
    notifications: {
      email: true,
      internal: false,
    },
  });

  const handleChange = (e) =>
    setSettings({ ...settings, [e.target.name]: e.target.value });

  const toggle2FA = () =>
    setSettings((prev) => ({ ...prev, twoFactor: !prev.twoFactor }));

  const toggleNotify = (field) =>
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: !prev.notifications[field],
      },
    }));

  const handleSave = () => {
    alert("Lưu thay đổi thành công!");
  };

  return (
    <div className="space-y-6">
      <Section title="Thông tin đăng nhập">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Email đăng nhập</label>
            <input
              name="email"
              type="email"
              value={settings.email}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Số điện thoại</label>
            <input
              name="phone"
              type="text"
              value={settings.phone}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>
        <button
          onClick={() => alert("Đổi mật khẩu")}
          className="mt-4 flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm"
        >
          <KeyRound className="w-4 h-4" /> Đổi mật khẩu
        </button>
      </Section>

      <Section title="Bảo mật">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-gray-500" />
            <div>
              <div className="font-medium">Xác thực 2 bước</div>
              <div className="text-sm text-gray-500">
                Tăng cường bảo mật tài khoản
              </div>
            </div>
          </div>
          <button
            onClick={toggle2FA}
            className={`px-3 py-1.5 rounded-full text-sm ${
              settings.twoFactor
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {settings.twoFactor ? "Đang bật" : "Đang tắt"}
          </button>
        </div>
      </Section>

      <Section title="Thông báo">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <div className="font-medium">Nhận qua Email</div>
                <div className="text-sm text-gray-500">
                  Thông báo khi có yêu cầu mới
                </div>
              </div>
            </div>
            <button
              onClick={() => toggleNotify("email")}
              className={`px-3 py-1.5 rounded-full text-sm ${
                settings.notifications.email
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {settings.notifications.email ? "Bật" : "Tắt"}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-500" />
              <div>
                <div className="font-medium">Thông báo nội bộ</div>
                <div className="text-sm text-gray-500">
                  Hiển thị trên hệ thống
                </div>
              </div>
            </div>
            <button
              onClick={() => toggleNotify("internal")}
              className={`px-3 py-1.5 rounded-full text-sm ${
                settings.notifications.internal
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {settings.notifications.internal ? "Bật" : "Tắt"}
            </button>
          </div>
        </div>
      </Section>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
};

export default AccountSettingsTab;
