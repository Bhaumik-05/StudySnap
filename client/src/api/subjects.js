import api from "../lib/api";

export async function fetchSubjects() {
  const response = await api.get("/subjects");
  return response.data;
}

export async function createSubject({ subjectName, deptId }) {
  const response = await api.post("/subjects", { subjectName, deptId });
  return response.data;
}

export async function updateSubject(id, { subjectName, deptId }) {
  const response = await api.patch(`/subjects/${id}`, { subjectName, deptId });
  return response.data;
}

export async function deleteSubject(id) {
  const response = await api.delete(`/subjects/${id}`);
  return response.data;
}
