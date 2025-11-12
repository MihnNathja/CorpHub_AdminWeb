import api from "../../../services/api";

export const getMyCompetencies = async () => {
  const res = await api.get("/api/employee/competency/me");
  return res.data;
};

export const getCompetencyTypes = async () => {
  const res = await api.get("/api/parameters/competency-types");
  return res;
};

export const createCompetency = async (data) => {
  console.log(data);
  const res = await api.post(`/api/employee/competency`, data);
  return res.data;
};

export const updateCompetency = async (data) => {
  console.log(data);
  const res = await api.put(`/api/employee/competency`, data);
  return res.data;
};

export const deleteCompetency = async (id, isDeletedFile) => {
  const res = await api.delete(
    `/api/employee/competency/${id}?isDeletedFile=${isDeletedFile}`
  );
  return res;
};
