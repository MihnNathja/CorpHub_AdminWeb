import { useState } from "react";

const EmployeeProfileForm = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    dob: "",
    gender: "",
    phone: "",
    personalEmail: "",
    departmentId: "",
    jobHistories: [],
    competencies: [],
  });

  // Lịch sử công việc tạm
  const [jobHistory, setJobHistory] = useState({
    departmentId: "",
    position: "",
    contractType: "",
    startDate: "",
    endDate: "",
    employmentStatus: "",
    note: "",
  });

  // Kỹ năng tạm
  const [competency, setCompetency] = useState({
    type: "",
    name: "",
    level: "",
    issuedBy: "",
    issuedDate: "",
    note: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Dữ liệu gửi đi:", profile);
    // gọi API POST /api/employee-profiles
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Thêm Hồ sơ Nhân viên</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thông tin cơ bản */}
        <section>
          <h3 className="font-semibold mb-2">Thông tin cơ bản</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="fullName"
              placeholder="Họ và tên"
              value={profile.fullName}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="date"
              name="dob"
              value={profile.dob}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="">-- Giới tính --</option>
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
            </select>
            <input
              type="text"
              name="phone"
              placeholder="Số điện thoại"
              value={profile.phone}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="email"
              name="personalEmail"
              placeholder="Email cá nhân"
              value={profile.personalEmail}
              onChange={handleChange}
              className="col-span-2 border p-2 rounded"
            />
            <select
              name="departmentId"
              value={profile.departmentId}
              onChange={handleChange}
              className="col-span-2 border p-2 rounded"
            >
              <option value="">-- Chọn phòng ban --</option>
              {/* map departments từ API */}
            </select>
          </div>
        </section>

        {/* Lịch sử công việc */}
        <section>
          <h3 className="font-semibold mb-2">Lịch sử công việc</h3>
          {/* Form thêm 1 jobHistory */}
          <div className="grid grid-cols-2 gap-4 mb-2">
            <input
              type="text"
              placeholder="Vị trí"
              value={jobHistory.position}
              onChange={(e) =>
                setJobHistory({ ...jobHistory, position: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Loại hợp đồng"
              value={jobHistory.contractType}
              onChange={(e) =>
                setJobHistory({ ...jobHistory, contractType: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="date"
              value={jobHistory.startDate}
              onChange={(e) =>
                setJobHistory({ ...jobHistory, startDate: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="date"
              value={jobHistory.endDate}
              onChange={(e) =>
                setJobHistory({ ...jobHistory, endDate: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Tình trạng"
              value={jobHistory.employmentStatus}
              onChange={(e) =>
                setJobHistory({
                  ...jobHistory,
                  employmentStatus: e.target.value,
                })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Ghi chú"
              value={jobHistory.note}
              onChange={(e) =>
                setJobHistory({ ...jobHistory, note: e.target.value })
              }
              className="border p-2 rounded"
            />
          </div>
          <button
            type="button"
            onClick={() =>
              setProfile((prev) => ({
                ...prev,
                jobHistories: [...prev.jobHistories, jobHistory],
              }))
            }
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            + Thêm lịch sử
          </button>

          {/* Danh sách đã thêm */}
          <ul className="mt-2 text-sm">
            {profile.jobHistories.map((job, i) => (
              <li key={i} className="border p-2 rounded mb-1">
                {job.position} ({job.startDate} - {job.endDate})
              </li>
            ))}
          </ul>
        </section>

        {/* Năng lực */}
        <section>
          <h3 className="font-semibold mb-2">Năng lực / Kỹ năng</h3>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <select
              value={competency.type}
              onChange={(e) =>
                setCompetency({ ...competency, type: e.target.value })
              }
              className="border p-2 rounded"
            >
              <option value="">-- Loại --</option>
              <option value="SKILL">Kỹ năng</option>
              <option value="DEGREE">Bằng cấp</option>
              <option value="CERTIFICATION">Chứng chỉ</option>
              <option value="LANGUAGE">Ngoại ngữ</option>
            </select>
            <input
              type="text"
              placeholder="Tên"
              value={competency.name}
              onChange={(e) =>
                setCompetency({ ...competency, name: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Trình độ"
              value={competency.level}
              onChange={(e) =>
                setCompetency({ ...competency, level: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Đơn vị cấp"
              value={competency.issuedBy}
              onChange={(e) =>
                setCompetency({ ...competency, issuedBy: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="date"
              value={competency.issuedDate}
              onChange={(e) =>
                setCompetency({ ...competency, issuedDate: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Ghi chú"
              value={competency.note}
              onChange={(e) =>
                setCompetency({ ...competency, note: e.target.value })
              }
              className="border p-2 rounded"
            />
          </div>
          <button
            type="button"
            onClick={() =>
              setProfile((prev) => ({
                ...prev,
                competencies: [...prev.competencies, competency],
              }))
            }
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            + Thêm năng lực
          </button>

          <ul className="mt-2 text-sm">
            {profile.competencies.map((c, i) => (
              <li key={i} className="border p-2 rounded mb-1">
                {c.type} - {c.name}
              </li>
            ))}
          </ul>
        </section>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded"
        >
          Lưu Hồ sơ
        </button>
      </form>
    </div>
  );
};

export default EmployeeProfileForm;
