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

const formatDate = (d) => (d ? new Date(d).toLocaleDateString("vi-VN") : "-");

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
      showError("Email tối đa 100 ký tự");
      return;
    }
    if (phone && phone.length > 20) {
      showError("Số điện thoại tối đa 20 ký tự");
      return;
    }
    if (address && address.length > 255) {
      showError("Địa chỉ tối đa 255 ký tự");
      return;
    }
    if (about && about.length > 2000) {
      showError("Giới thiệu tối đa 2000 ký tự");
      return;
    }

    const res = await updateContact({ personalEmail, phone, address, about });
    if (res.meta.requestStatus === "fulfilled") {
      showSuccess("Cập nhật thông tin liên hệ thành công");
      setIsEditingContact(false);
    }
  };

  const safeProfile = profile || {};

  const tags = useMemo(() => safeProfile.tags || [], [safeProfile]);
  const timelineItems = useMemo(
    () => safeProfile.timeline || [],
    [safeProfile]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Section title="Giới thiệu">
          {safeProfile.about ? (
            <p className="text-sm text-gray-700 leading-6">
              {safeProfile.about}
            </p>
          ) : (
            <p className="text-sm text-gray-400 italic">
              Chưa có phần giới thiệu
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.length ? (
              tags.map((tag) => <Badge key={tag}>{tag}</Badge>)
            ) : (
              <span className="text-sm text-gray-400 italic">
                Chưa có thẻ kỹ năng nào
              </span>
            )}
          </div>
        </Section>

        <Section title="Thông tin công việc hiện tại">
          <div className="grid sm:grid-cols-2 gap-3">
            <KeyValue
              label="Phòng ban"
              value={safeProfile.departmentName}
              icon={Building2}
            />
            <KeyValue
              label="Chức vụ"
              value={safeProfile.positionName}
              icon={FileBadge}
            />
            <KeyValue
              label="Loại hợp đồng"
              value={safeProfile.contractType || "Hợp đồng chính thức"}
              icon={ShieldCheck}
            />
            <KeyValue
              label="Ngày vào làm"
              value={formatDate(safeProfile.joinDate)}
              icon={Calendar}
            />
            <KeyValue
              label="Trạng thái"
              value={
                safeProfile.status === "ACTIVE" ? (
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                    Đang làm việc
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                    Không hoạt động
                  </span>
                )
              }
              icon={ShieldCheck}
            />
            <KeyValue
              label="Quản lý trực tiếp"
              value={safeProfile.managerName || "-"}
              icon={Building2}
            />
          </div>
        </Section>

        <TimelineSection items={timelineItems} />
      </div>

      <div className="space-y-6">
        <Section title="Thông tin cá nhân">
          <KeyValue
            label="Họ tên"
            value={safeProfile.fullName}
            icon={UserRound}
          />
          <KeyValue
            label="Giới tính"
            value={safeProfile.gender}
            icon={UserRound}
          />
          <KeyValue
            label="Ngày sinh"
            value={formatDate(safeProfile.dob)}
            icon={Calendar}
          />
          <KeyValue
            label="Tình trạng hôn nhân"
            value={safeProfile.maritalStatus || "-"}
            icon={Heart}
          />
          <KeyValue
            label="CMND/CCCD"
            value={safeProfile.identityNumber || "-"}
            icon={IdCard}
          />
          <KeyValue
            label="Ngày cấp"
            value={formatDate(safeProfile.identityIssuedDate)}
            icon={Calendar}
          />
          <KeyValue
            label="Nơi cấp"
            value={safeProfile.identityIssuedPlace || "-"}
            icon={MapPin}
          />
        </Section>

        <Section
          title="Liên hệ"
          right={
            <button
              onClick={() => setIsEditingContact((v) => !v)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {isEditingContact ? "Hủy" : "Chỉnh sửa"}
            </button>
          }
        >
          {!isEditingContact ? (
            <div className="space-y-2">
              <KeyValue
                label="Email cá nhân"
                value={safeProfile.personalEmail || "-"}
                icon={Mail}
              />
              <KeyValue
                label="Số điện thoại"
                value={safeProfile.phone || "-"}
                icon={Phone}
              />
              <KeyValue
                label="Địa chỉ thường trú"
                value={safeProfile.address || "-"}
                icon={MapPin}
              />
              <KeyValue
                label="Giới thiệu"
                value={safeProfile.about || "-"}
                icon={UserRound}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">Email cá nhân</label>
                <input
                  name="personalEmail"
                  value={contactForm.personalEmail}
                  onChange={handleContactChange}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Nhập email cá nhân"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Số điện thoại</label>
                <input
                  name="phone"
                  value={contactForm.phone}
                  onChange={handleContactChange}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">
                  Địa chỉ thường trú
                </label>
                <input
                  name="address"
                  value={contactForm.address}
                  onChange={handleContactChange}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Nhập địa chỉ"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Giới thiệu</label>
                <textarea
                  name="about"
                  value={contactForm.about}
                  onChange={handleContactChange}
                  rows={3}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Mô tả ngắn về bạn"
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
                  Hủy
                </button>
                <button
                  onClick={handleSaveContact}
                  disabled={updatingContact}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {updatingContact ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </div>
          )}
        </Section>

        <Section title="Thông tin hành chính & tài chính">
          <KeyValue
            label="Mã số thuế cá nhân"
            value={safeProfile.taxCode || "-"}
            icon={CreditCard}
          />
          <KeyValue
            label="Số sổ BHXH"
            value={safeProfile.socialInsuranceNumber || "-"}
            icon={ShieldCheck}
          />
          <KeyValue
            label="Tài khoản ngân hàng"
            value={
              safeProfile.bankAccountNumber
                ? `${safeProfile.bankAccountNumber} (${safeProfile.bankName})`
                : "-"
            }
            icon={Wallet}
          />
        </Section>
      </div>
    </div>
  );
};

export default OverviewTab;
