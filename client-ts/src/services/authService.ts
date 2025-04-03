import { api } from "./api";

export const login = async (email: string, password: string) => {
  const response = await api.post("/identity/account/login", { email, password });
  return response.data;
};

export const logout = async () => {
  await api.post("/identity/account/logout");
};

export const register = async (email: string, password: string) => {
  const response = await api.post("/identity/account/register", { email, password });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/identity/account/me");
  return response.data;
};