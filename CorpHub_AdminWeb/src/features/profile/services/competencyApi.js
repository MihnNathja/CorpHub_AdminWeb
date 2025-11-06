import api from "../../../services/api";

export const getMyCompetencies = async () => {
  const res = await api.get("/api/employee/competency/me");
  return res.data;
};
