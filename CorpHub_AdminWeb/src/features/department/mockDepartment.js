export const mockDepartments = [
  {
    id: 1,
    name: "Technology Department",
    manager: {
      id: 10,
      fullName: "Nguyen Van A",
      email: "a@company.com",
      avatar: "",
    },
    users: [
      {
        id: 101,
        fullName: "Tran Thi B",
        email: "b@company.com",
        avatar: "",
      },
      {
        id: 102,
        fullName: "Le C",
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
            fullName: "Pham D",
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
          fullName: "Nguyen E",
          email: "e@company.com",
        },
        users: [],
        children: [],
      },
    ],
  },
  {
    id: 4,
    name: "Business Department",
    manager: null,
    users: [],
    children: [],
  },
];
