import api from "../lib/api";

export async function getUploadHistory() {
    const response = await api.get("/users/uploads");
    return response.data;
}

export async function getDownloadHistory() {
    const response = await api.get("/downloads");
    return response.data;
}