import api from "../api";

export const login = async (email: string, password: string) => {
  const response = await api.post("/auth/login", { email, password });
  const token = response.data.token;

  localStorage.setItem("token", token);
  return token;
};

export const logout = async () => {
  await api.post("/auth/logout");
  localStorage.removeItem("token");
};

export const register = async (email: string, password: string) => {
  const response = await api.post("/auth/register", { email, password });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
