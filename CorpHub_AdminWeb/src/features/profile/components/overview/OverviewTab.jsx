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
  BadgeCheck,
} from "lucide-react";
import TimelineSection from "./TimelineSection";

const formatDate = (d) => (d ? new Date(d).toLocaleDateString("vi-VN") : "-");

const profile = {
  fullName: "Nguyễn Văn A",
  gender: "Nam",
  dob: "1998-05-21",
  maritalStatus: "Độc thân",
  personalEmail: "nguyenvana@example.com",
  phone: "0912345678",
  address: "123 Lý Thường Kiệt, Hà Nội",
  departmentName: "Phòng Kỹ thuật",
  positionName: "Kỹ sư phần mềm",
  contractType: "Hợp đồng chính thức",
  joinDate: "2020-06-01",
  status: "ACTIVE",
  manager: "Trần Thị B (Trưởng phòng Kỹ thuật)",
  identityNumber: "012345678901",
  identityIssuedDate: "2015-08-10",
  identityIssuedPlace: "Công an TP Hà Nội",
  taxCode: "1234567890",
  socialInsuranceNumber: "9876543210",
  bankAccountNumber: "0123456789",
  bankName: "Vietcombank - CN Hà Nội",
  about:
    "Kỹ sư phần mềm với hơn 3 năm kinh nghiệm phát triển hệ thống nội bộ, am hiểu ReactJS và Spring Boot.",
  tags: ["ReactJS", "Spring Boot", "SQL", "Teamwork"],
  timeline: [
    { text: "Gia nhập công ty", time: "06/2020" },
    { text: "Thăng chức Kỹ sư chính", time: "09/2022" },
    { text: "Đạt danh hiệu nhân viên xuất sắc", time: "03/2024" },
  ],
  user: { roleName: "Nhân viên" },
  code: "EMP-001",
  active: true,
  avatarUrl: "https://i.pravatar.cc/150?img=3",
};

const OverviewTab = ({}) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* ========== CỘT TRÁI ========== */}
    <div className="lg:col-span-2 space-y-6">
      {/* Giới thiệu */}
      <Section title="Giới thiệu">
        {profile.about ? (
          <p className="text-sm text-gray-700 leading-6">{profile.about}</p>
        ) : (
          <p className="text-sm text-gray-400 italic">
            Chưa có phần giới thiệu
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          {profile.tags?.length ? (
            profile.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)
          ) : (
            <span className="text-sm text-gray-400 italic">
              Chưa có thẻ kỹ năng nào
            </span>
          )}
        </div>
      </Section>

      {/* Thông tin công việc hiện tại */}
      <Section title="Thông tin công việc hiện tại">
        <div className="grid sm:grid-cols-2 gap-3">
          <KeyValue
            label="Phòng ban"
            value={profile.departmentName}
            icon={Building2}
          />
          <KeyValue
            label="Chức vụ"
            value={profile.positionName}
            icon={FileBadge}
          />
          <KeyValue
            label="Loại hợp đồng"
            value={profile.contractType || "Hợp đồng chính thức"}
            icon={ShieldCheck}
          />
          <KeyValue
            label="Ngày vào làm"
            value={formatDate(profile.joinDate)}
            icon={Calendar}
          />
          <KeyValue
            label="Trạng thái"
            value={
              profile.status === "ACTIVE" ? (
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
            value={profile.manager || "-"}
            icon={Building2}
          />
        </div>
      </Section>

      {/* Dòng thời gian */}
      <TimelineSection items={profile.timeline} />
    </div>

    {/* ========== CỘT PHẢI ========== */}
    <div className="space-y-6">
      {/* Thông tin cá nhân */}
      <Section title="Thông tin cá nhân">
        <KeyValue label="Họ tên" value={profile.fullName} icon={UserRound} />
        <KeyValue label="Giới tính" value={profile.gender} icon={UserRound} />
        <KeyValue
          label="Ngày sinh"
          value={formatDate(profile.dob)}
          icon={Calendar}
        />
        <KeyValue
          label="Tình trạng hôn nhân"
          value={profile.maritalStatus || "-"}
          icon={Heart}
        />
        <KeyValue
          label="CMND/CCCD"
          value={profile.identityNumber || "-"}
          icon={IdCard}
        />
        <KeyValue
          label="Ngày cấp"
          value={formatDate(profile.identityIssuedDate)}
          icon={Calendar}
        />
        <KeyValue
          label="Nơi cấp"
          value={profile.identityIssuedPlace || "-"}
          icon={MapPin}
        />
      </Section>

      {/* Liên hệ */}
      <Section title="Liên hệ">
        <KeyValue
          label="Email cá nhân"
          value={profile.personalEmail}
          icon={Mail}
        />
        <KeyValue label="Số điện thoại" value={profile.phone} icon={Phone} />
        <KeyValue
          label="Địa chỉ thường trú"
          value={profile.address}
          icon={MapPin}
        />
      </Section>

      {/* Thông tin tài chính & xã hội */}
      <Section title="Thông tin hành chính & tài chính">
        <KeyValue
          label="Mã số thuế cá nhân"
          value={profile.taxCode || "-"}
          icon={CreditCard}
        />
        <KeyValue
          label="Số sổ BHXH"
          value={profile.socialInsuranceNumber || "-"}
          icon={ShieldCheck}
        />
        <KeyValue
          label="Tài khoản ngân hàng"
          value={
            profile.bankAccountNumber
              ? `${profile.bankAccountNumber} (${profile.bankName})`
              : "-"
          }
          icon={Wallet}
        />
      </Section>
    </div>
  </div>
);

export default OverviewTab;
