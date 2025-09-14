// services/calendarService.js
export const fetchFakeEvents = () => {
  return Promise.resolve([
    {
      id: 1,
      title: "Cuộc họp team",
      date: "2025-09-16",
    },
    {
      id: 2,
      title: "Deadline dự án ABC",
      date: "2025-09-20",
    },
    {
      id: 3,
      title: "Họp khách hàng",
      date: "2025-09-14",
    },
  ]);
};
