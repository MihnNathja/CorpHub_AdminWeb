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
    title="Contact information"
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
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-900/30"
        >
          Edit
        </button>
      )
    }
  >
    {editing ? (
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InputField
          label="Personal email"
          value={contactForm.personalEmail}
          onChange={(e) =>
            setContactForm((p) => ({
              ...p,
              personalEmail: e.target.value,
            }))
          }
        />
        <InputField
          label="Phone number"
          value={contactForm.phone}
          onChange={(e) =>
            setContactForm((p) => ({ ...p, phone: e.target.value }))
          }
        />
        <InputField
          label="Address"
          value={contactForm.address}
          onChange={(e) =>
            setContactForm((p) => ({
              ...p,
              address: e.target.value,
            }))
          }
        />
        <TextAreaField
          label="About"
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
        <InfoRow label="Personal email" value={profile.personalEmail} />
        <InfoRow label="Phone number" value={profile.phone} />
        <InfoRow label="Address" value={profile.address} />
        <InfoRow label="About" value={profile.about} />
      </div>
    )}
  </Card>
);

export default EmployeeDetailContactSection;
