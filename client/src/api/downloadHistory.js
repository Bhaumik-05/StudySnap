import api from "../lib/api";

export async function fetchDownloadHistory() {
  const response = await api.get("/downloads");
  return response.data;
}
