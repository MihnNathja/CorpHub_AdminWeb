import { useEffect, useMemo, useState } from "react";
import Section from "../Section";
import Badge from "../Badge";
import KeyValue from "../KeyValue";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  UserRound,
  Building2,
  ShieldCheck,
  CreditCard,
  IdCard,
  Wallet,
  Heart,
  FileBadge,
} from "lucide-react";
import TimelineSection from "./TimelineSection";
import { useProfile } from "../../hooks/useProfile";
import { showError, showSuccess } from "../../../../utils/toastUtils";

const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-US") : "-");

const OverviewTab = () => {
  const { profile, loading, fetchBasicInfo, updateContact, updatingContact } =
    useProfile();

  const [isEditingContact, setIsEditingContact] = useState(false);
  const [contactForm, setContactForm] = useState({
    personalEmail: "",
    phone: "",
    address: "",
    about: "",
  });

  useEffect(() => {
    fetchBasicInfo();
  }, [fetchBasicInfo]);

  useEffect(() => {
    if (profile) {
      setContactForm((prev) => ({
        ...prev,
        personalEmail: profile.personalEmail || "",
        phone: profile.phone || "",
        address: profile.address || "",
        about: profile.about || "",
      }));
    }
  }, [profile]);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveContact = async () => {
    const { personalEmail, phone, address, about } = contactForm;
    // lightweight client checks
    if (personalEmail && personalEmail.length > 100) {
      showError("Email must be at most 100 characters");
      return;
    }
    if (phone && phone.length > 20) {
      showError("Phone must be at most 20 characters");
      return;
    }
    if (address && address.length > 255) {
      showError("Address must be at most 255 characters");
      return;
    }
    if (about && about.length > 2000) {
      showError("About section must be at most 2000 characters");
      return;
    }

    const res = await updateContact({ personalEmail, phone, address, about });
    if (res.meta.requestStatus === "fulfilled") {
      showSuccess("Contact information updated successfully");
      setIsEditingContact(false);
    }
  };

  const safeProfile = profile || {};
  const adminInfo = safeProfile.employeeAdministrativeInfoDto || {};

  console.log(safeProfile);

  const tags = useMemo(() => safeProfile.tags || [], [safeProfile]);
  const timelineItems = useMemo(
    () => safeProfile.timeline || [],
    [safeProfile]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Section title="About">
          {safeProfile.about ? (
            <p className="text-sm text-gray-700 leading-6">
              {safeProfile.about}
            </p>
          ) : (
            <p className="text-sm text-gray-400 italic">No introduction yet</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.length ? (
              tags.map((tag) => <Badge key={tag}>{tag}</Badge>)
            ) : (
              <span className="text-sm text-gray-400 italic">
                No skill tags yet
              </span>
            )}
          </div>
        </Section>

        <Section
          title="Contact"
          right={
            <button
              onClick={() => setIsEditingContact((v) => !v)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {isEditingContact ? "Cancel" : "Edit"}
            </button>
          }
        >
          {!isEditingContact ? (
            <div className="space-y-2">
              <KeyValue
                label="Personal email"
                value={safeProfile.personalEmail || "-"}
                icon={Mail}
              />
              <KeyValue
                label="Phone number"
                value={safeProfile.phone || "-"}
                icon={Phone}
              />
              <KeyValue
                label="Permanent address"
                value={safeProfile.address || "-"}
                icon={MapPin}
              />
              <KeyValue
                label="About"
                value={safeProfile.about || "-"}
                icon={UserRound}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">Personal email</label>
                <input
                  name="personalEmail"
                  value={contactForm.personalEmail}
                  onChange={handleContactChange}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter personal email"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Phone number</label>
                <input
                  name="phone"
                  value={contactForm.phone}
                  onChange={handleContactChange}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">
                  Permanent address
                </label>
                <input
                  name="address"
                  value={contactForm.address}
                  onChange={handleContactChange}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter address"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">About</label>
                <textarea
                  name="about"
                  value={contactForm.about}
                  onChange={handleContactChange}
                  rows={3}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Write a short intro about yourself"
                />
                <p className="mt-1 text-xs text-gray-400">
                  {contactForm.about?.length || 0}/2000
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditingContact(false)}
                  className="rounded-lg border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  disabled={updatingContact}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveContact}
                  disabled={updatingContact}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {updatingContact ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          )}
        </Section>

        <Section title="Current job information">
          <div className="grid sm:grid-cols-2 gap-3">
            <KeyValue
              label="Department"
              value={safeProfile.departmentName}
              icon={Building2}
            />
            <KeyValue
              label="Position"
              value={safeProfile.positionName}
              icon={FileBadge}
            />
            <KeyValue
              label="Contract type"
              value={safeProfile.contractType || "Official contract"}
              icon={ShieldCheck}
            />
            <KeyValue
              label="Join date"
              value={formatDate(safeProfile.joinDate)}
              icon={Calendar}
            />
            <KeyValue
              label="Status"
              value={
                safeProfile.status === "ACTIVE" ? (
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                    Working
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                    Inactive
                  </span>
                )
              }
              icon={ShieldCheck}
            />
            <KeyValue
              label="Direct manager"
              value={safeProfile.managerName || "-"}
              icon={Building2}
            />
          </div>
        </Section>
      </div>

      <div className="space-y-6">
        <Section title="Personal information">
          <KeyValue
            label="Full name"
            value={safeProfile.fullName}
            icon={UserRound}
          />
          <KeyValue
            label="Gender"
            value={safeProfile.gender}
            icon={UserRound}
          />
          <KeyValue
            label="Date of birth"
            value={formatDate(safeProfile.dob)}
            icon={Calendar}
          />
          <KeyValue
            label="Marital status"
            value={adminInfo.maritalStatus || "-"}
            icon={Heart}
          />
          <KeyValue
            label="National ID"
            value={adminInfo.identityNumber || undefined}
            icon={IdCard}
            sensitive
          />
          <KeyValue
            label="Issued date"
            value={formatDate(adminInfo.identityIssuedDate)}
            icon={Calendar}
          />
          <KeyValue
            label="Place of issue"
            value={adminInfo.identityIssuedPlace || "-"}
            icon={MapPin}
          />
        </Section>

        <Section title="Administrative & financial information">
          <KeyValue
            label="Personal tax code"
            value={adminInfo.taxCode || undefined}
            icon={CreditCard}
            sensitive
          />
          <KeyValue
            label="Social insurance number"
            value={adminInfo.socialInsuranceNumber || undefined}
            icon={ShieldCheck}
            sensitive
          />
          <KeyValue
            label="Bank account"
            value={
              adminInfo.bankAccountNumber
                ? `${adminInfo.bankAccountNumber} (${adminInfo.bankName})`
                : undefined
            }
            icon={Wallet}
            sensitive={Boolean(adminInfo.bankAccountNumber)}
          />
        </Section>
      </div>
    </div>
  );
};

export default OverviewTab;
