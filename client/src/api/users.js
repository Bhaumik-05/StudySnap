import api from "../lib/api";

export async function getCurrentUser() {
  const response = await api.get("/users/me");
  return response.data;
}

export async function updateCurrentUser(payload) {
  const response = await api.patch("/users/me", payload);
  return response.data;
}

export async function getUploadHistory() {
  const response = await api.get("/users/uploads");
  return response.data;
}
