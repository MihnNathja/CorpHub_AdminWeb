export const mockRoles = [
  {
    id: 1,
    name: "Admin",
    description: "Toàn quyền hệ thống",
    permissions: ["user.view", "user.edit", "ticket.manage", "role.manage"],
  },
  {
    id: 2,
    name: "Nhân viên",
    description: "Quyền cơ bản để xử lý công việc",
    permissions: ["ticket.view", "ticket.create"],
  },
  {
    id: 3,
    name: "Trưởng phòng",
    description: "Phê duyệt và theo dõi tiến độ nhóm",
    permissions: ["ticket.view", "ticket.approve", "user.view"],
  },
];

export const allPermissions = [
  "user.view",
  "user.edit",
  "user.delete",
  "ticket.view",
  "ticket.create",
  "ticket.manage",
  "ticket.approve",
  "role.manage",
];
