import React, { useState } from "react";
import {
  Pencil,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  KeyRound,
  Lock,
  Unlock,
  Building2,
  UserRound,
  BadgeCheck,
} from "lucide-react";

// =================== DỮ LIỆU GIẢ ===================
const mockEmployee = {
  id: "EMP-0001",
  fullName: "Nguyễn Văn A",
  avatar:
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=400&auto=format&fit=facearea&facepad=2&h=400",
  code: "A001",
  position: "Chuyên viên IT Support",
  role: "STAFF",
  department: { id: "D01", name: "Phòng CNTT" },
  active: true,
  phone: "0901 234 567",
  email: "nguyenvana@company.vn",
  address: "Tầng 5, Tòa nhà ABC, Q.1, TP.HCM",
  joinDate: "2023-03-12",
  sex: "Nam",
  dob: "1996-11-24",
  manager: "Trần B",
  tags: ["Full-time", "Onsite", "AD Access"],
  skills: ["Windows", "Network", "Helpdesk", "SQL Basics"],
  about:
    "Thành viên nhóm IT Helpdesk, phụ trách xử lý sự cố người dùng nội bộ, quản lý tài khoản AD và phần mềm văn phòng.",
  timeline: [
    { time: "2025-10-22 14:10", text: "Reset mật khẩu cho user HR-023" },
    { time: "2025-10-20 09:14", text: "Đăng nhập hệ thống" },
    { time: "2025-09-29 16:32", text: "Hoàn tất checklist onboarding" },
  ],
  documents: [
    { name: "HĐLĐ_2023.pdf", size: "1.2 MB" },
    { name: "CV_NguyenVanA.pdf", size: "320 KB" },
  ],
  jobHistory: [
    {
      id: 1,
      department: "Phòng Kỹ thuật",
      position: "Nhân viên IT Support",
      contractType: "HĐLĐ xác định thời hạn",
      startDate: "2022-03-01",
      endDate: "2023-03-01",
      employmentStatus: "Hoàn thành",
      note: "Hoàn thành tốt nhiệm vụ",
    },
    {
      id: 2,
      department: "Phòng CNTT",
      position: "Chuyên viên IT Support",
      contractType: "HĐLĐ không xác định thời hạn",
      startDate: "2023-03-02",
      endDate: null,
      employmentStatus: "Đang làm việc",
      note: "Được đề bạt vị trí chính thức",
    },
  ],
  competencies: [
    {
      id: 1,
      type: "CERTIFICATION",
      name: "CompTIA Network+",
      level: "Intermediate",
      issuedBy: "CompTIA",
      issuedDate: "2023-08-10",
      note: "Chứng chỉ quốc tế về mạng máy tính",
    },
    {
      id: 2,
      type: "LANGUAGE",
      name: "Tiếng Anh",
      level: "IELTS 6.5",
      issuedBy: "IDP",
      issuedDate: "2022-12-01",
      note: "Khả năng đọc hiểu tài liệu kỹ thuật tốt",
    },
    {
      id: 3,
      type: "SKILL",
      name: "SQL Database",
      level: "Advanced",
      issuedBy: "Nội bộ",
      issuedDate: "2024-02-15",
      note: "Đạt kết quả xuất sắc trong khoá đào tạo nội bộ",
    },
  ],
};

// =================== COMPONENT ===================
const Badge = ({ children, color = "gray" }) => (
  <span
    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-${color}-100 text-${color}-700`}
  >
    {children}
  </span>
);

const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
    <h3 className="text-base font-semibold text-gray-900 mb-3">{title}</h3>
    {children}
  </div>
);

const KeyValue = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
    {Icon && <Icon className="w-4 h-4 mt-1 text-gray-400" />}
    <div>
      <div className="text-xs uppercase text-gray-500">{label}</div>
      <div className="text-sm text-gray-800">{value}</div>
    </div>
  </div>
);

const EmployeeProfilePage = () => {
  const [profile, setProfile] = useState(mockEmployee);
  const [tab, setTab] = useState("Tổng quan");

  const toggleActive = () => setProfile((p) => ({ ...p, active: !p.active }));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-2xl mb-6">
        <div className="h-16 bg-gradient-to-r from-indigo-500 to-blue-500" />
        <div className="bg-white p-4 flex items-end gap-4 -mt-16 rounded-t-2xl shadow">
          <img
            src={profile.avatar}
            alt="avatar"
            className="w-28 h-28 rounded-2xl border-4 border-white object-cover"
          />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold">{profile.fullName}</h1>
              <Badge color="blue">{profile.position}</Badge>
              <Badge color="yellow">{profile.department.name}</Badge>
              <Badge color={profile.active ? "green" : "red"}>
                {profile.active ? "Đang hoạt động" : "Đã khóa"}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">
              Mã NV: {profile.code} • Vai trò: {profile.role}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 border rounded-xl flex items-center gap-2 hover:bg-gray-50">
              <Pencil className="w-4 h-4" /> Chỉnh sửa
            </button>
            <button
              onClick={toggleActive}
              className={`px-3 py-2 rounded-xl flex items-center gap-2 ${
                profile.active
                  ? "border text-red-600 hover:bg-red-50"
                  : "bg-green-600 text-white"
              }`}
            >
              {profile.active ? (
                <Lock className="w-4 h-4" />
              ) : (
                <Unlock className="w-4 h-4" />
              )}
              {profile.active ? "Khóa" : "Mở"}
            </button>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="flex border-b mb-4">
          {["Tổng quan", "Hồ sơ công việc", "Tài liệu"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 ${
                tab === t
                  ? "border-b-2 border-indigo-500 font-semibold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* TAB NỘI DUNG */}
        {tab === "Tổng quan" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Section title="Giới thiệu">
                <p className="text-sm text-gray-700 leading-6">
                  {profile.about}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              </Section>

              <Section title="Dòng thời gian">
                <ul className="space-y-3">
                  {profile.timeline.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <BadgeCheck className="w-4 h-4 mt-1 text-gray-400" />
                      <div>
                        <div className="text-sm">{item.text}</div>
                        <div className="text-xs text-gray-500">{item.time}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </Section>
            </div>

            <div className="space-y-6">
              <Section title="Thông tin liên hệ">
                <KeyValue label="Email" value={profile.email} icon={Mail} />
                <KeyValue
                  label="Điện thoại"
                  value={profile.phone}
                  icon={Phone}
                />
                <KeyValue
                  label="Địa chỉ"
                  value={profile.address}
                  icon={MapPin}
                />
                <KeyValue
                  label="Ngày vào làm"
                  value={profile.joinDate}
                  icon={Calendar}
                />
                <KeyValue
                  label="Giới tính"
                  value={profile.sex}
                  icon={UserRound}
                />
                <KeyValue
                  label="Ngày sinh"
                  value={profile.dob}
                  icon={Calendar}
                />
                <KeyValue
                  label="Quản lý"
                  value={profile.manager}
                  icon={Building2}
                />
              </Section>

              <Section title="Bảo mật">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium">Xác thực</div>
                      <div className="text-sm text-gray-500">
                        Mật khẩu cập nhật gần đây
                      </div>
                    </div>
                  </div>
                  <button className="px-3 py-2 border rounded-xl flex items-center gap-2 hover:bg-gray-50">
                    <KeyRound className="w-4 h-4" /> Đặt lại mật khẩu
                  </button>
                </div>
              </Section>
            </div>
          </div>
        ) : tab === "Hồ sơ công việc" ? (
          <div className="divide-y">
            <Section title="Kỹ năng">
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 rounded-xl border text-sm bg-gray-50"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Section>

            {/* ========== LỊCH SỬ LÀM VIỆC ========== */}
            <Section title="Lịch sử làm việc">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border">
                  <thead className="bg-gray-100">
                    <tr className="text-left">
                      <th className="p-2 border">Phòng ban</th>
                      <th className="p-2 border">Chức vụ</th>
                      <th className="p-2 border">Loại hợp đồng</th>
                      <th className="p-2 border">Ngày bắt đầu</th>
                      <th className="p-2 border">Ngày kết thúc</th>
                      <th className="p-2 border">Trạng thái</th>
                      <th className="p-2 border">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.jobHistory.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50">
                        <td className="p-2 border">{job.department}</td>
                        <td className="p-2 border">{job.position}</td>
                        <td className="p-2 border">{job.contractType}</td>
                        <td className="p-2 border">{job.startDate}</td>
                        <td className="p-2 border">
                          {job.endDate || "Hiện tại"}
                        </td>
                        <td className="p-2 border">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              job.employmentStatus === "Đang làm việc"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {job.employmentStatus}
                          </span>
                        </td>
                        <td className="p-2 border">{job.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            {/* ========== CHỨNG CHỈ VÀ KỸ NĂNG ========== */}
            <Section title="Chứng chỉ & Kỹ năng">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border">
                  <thead className="bg-gray-100">
                    <tr className="text-left">
                      <th className="p-2 border">Loại</th>
                      <th className="p-2 border">Tên</th>
                      <th className="p-2 border">Trình độ</th>
                      <th className="p-2 border">Cấp bởi</th>
                      <th className="p-2 border">Ngày cấp</th>
                      <th className="p-2 border">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profile.competencies.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="p-2 border">{c.type}</td>
                        <td className="p-2 border">{c.name}</td>
                        <td className="p-2 border">{c.level}</td>
                        <td className="p-2 border">{c.issuedBy}</td>
                        <td className="p-2 border">{c.issuedDate}</td>
                        <td className="p-2 border">{c.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          </div>
        ) : (
          <Section title="Tài liệu nhân sự">
            <div className="divide-y">
              {profile.documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <div className="text-sm font-medium">{doc.name}</div>
                    <div className="text-xs text-gray-500">{doc.size}</div>
                  </div>
                  <button className="px-3 py-1.5 border rounded-xl text-sm hover:bg-gray-50">
                    Tải xuống
                  </button>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
};

export default EmployeeProfilePage;
