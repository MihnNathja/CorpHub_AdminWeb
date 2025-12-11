import React from "react";
import { Mail } from "lucide-react";
import { Card } from "./EmployeeDetailCard";
import { InputField, TextAreaField, InfoRow } from "./EmployeeDetailFields";

const EmployeeDetailContactSection = ({
  profile,
  contactForm,
  setContactForm,
  editing,
  setEditing,
  saving,
  onSave,
  onCancel,
}) => (
  <Card
    title="Thông tin liên hệ"
    icon={<Mail size={18} />}
    id="contact"
    actions={
      editing ? (
        <>
          <button
            type="button"
            disabled={saving}
            onClick={onSave}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
              saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saving ? "Đang lưu..." : "Lưu"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
          >
            Hủy
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-900/30"
        >
          Chỉnh sửa
        </button>
      )
    }
  >
    {editing ? (
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InputField
          label="Email cá nhân"
          value={contactForm.personalEmail}
          onChange={(e) =>
            setContactForm((p) => ({
              ...p,
              personalEmail: e.target.value,
            }))
          }
        />
        <InputField
          label="Số điện thoại"
          value={contactForm.phone}
          onChange={(e) =>
            setContactForm((p) => ({ ...p, phone: e.target.value }))
          }
        />
        <InputField
          label="Địa chỉ"
          value={contactForm.address}
          onChange={(e) =>
            setContactForm((p) => ({
              ...p,
              address: e.target.value,
            }))
          }
        />
        <TextAreaField
          label="Giới thiệu"
          value={contactForm.about}
          onChange={(e) =>
            setContactForm((p) => ({ ...p, about: e.target.value }))
          }
          rows={3}
          className="lg:col-span-3"
        />
      </div>
    ) : (
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <InfoRow label="Email cá nhân" value={profile.personalEmail} />
        <InfoRow label="Số điện thoại" value={profile.phone} />
        <InfoRow label="Địa chỉ" value={profile.address} />
        <InfoRow label="Giới thiệu" value={profile.about} />
      </div>
    )}
  </Card>
);

export default EmployeeDetailContactSection;
