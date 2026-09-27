import api from "../lib/api";

export async function fetchDashboardStats() {
    const response = await api.get("/dashboard");
    return response.data;
}