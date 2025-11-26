export const mockDepartments = [
  {
    id: 1,
    name: "Phòng Công Nghệ",
    manager: {
      id: 10,
      fullName: "Nguyễn Văn A",
      email: "a@company.com",
      avatar: "",
    },
    users: [
      {
        id: 101,
        fullName: "Trần Thị B",
        email: "b@company.com",
        avatar: "",
      },
      {
        id: 102,
        fullName: "Lê C",
        email: "c@company.com",
        avatar: "",
      },
    ],
    children: [
      {
        id: 2,
        name: "Team Backend",
        manager: null,
        users: [
          {
            id: 103,
            fullName: "Phạm D",
            email: "d@company.com",
            avatar: "",
          },
        ],
        children: [],
      },
      {
        id: 3,
        name: "Team Frontend",
        manager: {
          id: 11,
          fullName: "Nguyễn E",
          email: "e@company.com",
        },
        users: [],
        children: [],
      },
    ],
  },
  {
    id: 4,
    name: "Phòng Kinh Doanh",
    manager: null,
    users: [],
    children: [],
  },
];
