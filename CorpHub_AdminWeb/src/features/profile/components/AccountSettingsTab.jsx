import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Bell,
  Mail,
  Phone,
  KeyRound,
  EyeOff,
  Eye,
} from "lucide-react";
import Section from "./Section";
import { useProfile } from "../hooks/useProfile";
import { showError, showSuccess } from "../../../utils/toastUtils";
import ToggleSwitch from "./ToogleSwitch";

const AccountSettingsTab = ({ profile }) => {
  const { form, handleChange, handleSubmit, loading, success, error, reset } =
    useProfile();

  const [settings, setSettings] = useState({
    email: profile.user.username,
    phone: profile.phone,
    twoFactor: true,
    notifications: {
      email: true,
      internal: false,
    },
  });

  const [showChangePassword, setShowChangePassword] = useState(false);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
    showSuccess("Changes saved successfully!");
  };

  // ✅ Gọi API đổi mật khẩu
  const handleSubmitPassword = (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmNewPassword) {
      showError("Confirmation password does not match!");
      return;
    }

    handleSubmit(e);
  };

  // ✅ Theo dõi kết quả đổi mật khẩu
  useEffect(() => {
    if (success) {
      showSuccess("Password changed successfully!");
      reset();
      setShowChangePassword(false);
    }
  }, [success, reset]);

  useEffect(() => {
    if (error) {
      showError(error);
      reset();
    }
  }, [error, reset]);

  return (
    <div className="space-y-6">
      {/* ==================== Login information ==================== */}
      <Section title="Login information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Login email</label>
            <input
              name="email"
              type="email"
              value={settings.email}
              onChange={(e) =>
                setSettings({ ...settings, email: e.target.value })
              }
              disabled={true}
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Phone number</label>
            <input
              name="phone"
              type="text"
              value={settings.phone}
              onChange={(e) =>
                setSettings({ ...settings, phone: e.target.value })
              }
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Nút hiển thị form đổi mật khẩu */}
        <button
          onClick={() => setShowChangePassword((prev) => !prev)}
          className="mt-4 flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm"
        >
          <KeyRound className="w-4 h-4" />
          {showChangePassword ? "Cancel password change" : "Change password"}
        </button>

        {/* Form đổi mật khẩu */}
        {showChangePassword && (
          <form
            onSubmit={handleSubmitPassword}
            className="mt-4 space-y-3 border-t pt-4"
          >
            <div className="relative">
              <label className="text-sm text-gray-600">Current password</label>
              <div className="relative mt-1">
                <input
                  name="oldPassword"
                  type={showOld ? "text" : "password"}
                  value={form.oldPassword}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="relative">
              <label className="text-sm text-gray-600">New password</label>
              <div className="relative mt-1">
                <input
                  name="newPassword"
                  type={showNew ? "text" : "password"}
                  value={form.newPassword}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="relative">
              <label className="text-sm text-gray-600">
                Confirm new password
              </label>
              <div className="relative mt-1">
                <input
                  name="confirmNewPassword"
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmNewPassword}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowChangePassword(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-70"
              >
                {loading ? "Processing..." : "Confirm change"}
              </button>
            </div>
          </form>
        )}
      </Section>

      {/* ==================== Security ==================== */}
      {/* <Section title="Security">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-gray-500" />
            <div>
              <div className="font-medium">Two-factor authentication</div>
              <div className="text-sm text-gray-500">
                Enhance account security
              </div>
            </div>
          </div>
          <ToggleSwitch enabled={settings.twoFactor} onToggle={toggle2FA} />
        </div>
      </Section> */}

      {/* ==================== Notifications ==================== */}
      {/* <Section title="Notifications">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <div>
                <div className="font-medium">Receive via email</div>
                <div className="text-sm text-gray-500">
                  Notify when new requests arrive
                </div>
              </div>
            </div>
            <ToggleSwitch
              enabled={settings.notifications.email}
              onToggle={() => toggleNotify("email")}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-500" />
              <div>
                <div className="font-medium">Internal notifications</div>
                <div className="text-sm text-gray-500">Show in system</div>
              </div>
            </div>
            <ToggleSwitch
              enabled={settings.notifications.internal}
              onToggle={() => toggleNotify("internal")}
            />
          </div>
        </div>
      </Section> */}

      {/* ==================== Lưu thay đổi ==================== */}
      {/* <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
        >
          Save changes
        </button>
      </div> */}
    </div>
  );
};

export default AccountSettingsTab;
