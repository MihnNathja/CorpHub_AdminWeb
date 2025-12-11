import api from "../../../services/api";

export const getMyEmployeeProfile = async () => {
  const res = await api.get("/api/employee/me");
  return res;
};

export const updateMyContactInfo = async (payload) => {
  const res = await api.patch("/api/employee/me/contact-info", payload);
  return res;
};

export const changePassword = async (data) => {
  const res = await api.patch("/api/user/change-password", data);
  return res;
};

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  console.log(formData);

  return api.post("/api/employee/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
