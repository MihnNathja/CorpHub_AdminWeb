// src/features/employee/mock/mockEmployee.js
export const mockEmployee = {
  id: "EMP-0001",
  fullName: "Nguyễn Văn A",
  avatar:
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=400",
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
    "Thành viên nhóm IT Helpdesk, phụ trách xử lý sự cố người dùng nội bộ...",
  timeline: [
    { time: "2025-10-22 14:10", text: "Reset mật khẩu cho user HR-023" },
    { time: "2025-10-20 09:14", text: "Đăng nhập hệ thống" },
  ],
  documents: [{ name: "CV_NguyenVanA.pdf", size: "320 KB" }],
  jobHistory: [
    {
      id: 1,
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
  ],
};
