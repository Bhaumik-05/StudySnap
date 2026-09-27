import api from "../lib/api";

export async function fetchDepartments() {
  const response = await api.get("/departments");
  return response.data;
}

export async function createDepartment(deptName) {
  const response = await api.post("/departments", { deptName });
  return response.data;
}

export async function updateDepartment(id, deptName) {
  const response = await api.patch(`/departments/${id}`, { deptName });
  return response.data;
}

export async function deleteDepartment(id) {
  const response = await api.delete(`/departments/${id}`);
  return response.data;
}
