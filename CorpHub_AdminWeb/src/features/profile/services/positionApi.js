import api from "../../../services/api";

export const getDepartmentsWithPositions = async () => {
  const res = await api.get("/api/department/with-position");
  console.log(res.data);
  return res.data;
};
