import api from "../../../services/api";

export const changePassword = async (data) => {
  const res = await api.patch("/api/user/change-password", data);
  return res;
};
