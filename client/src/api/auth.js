import api from "../lib/api";

export async function registerUser(payload) {
  const response = await api.post("/auth/register", payload);
  return response.data;
}

export async function loginUser({ email, password }) {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
}

export async function logoutUser() {
  const response = await api.post("/auth/logout");
  return response.data;
}

export async function refreshAccessToken() {
  const response = await api.post("/auth/refresh");
  return response.data;
}