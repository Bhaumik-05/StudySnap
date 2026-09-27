import api from "../lib/api";

export const fetchDepartments = async () => {
  const response = await api.get("/departments");
  return response.data;
};

export const createDepartment = async (deptName) => {
  const response = await api.post("/departments", {
    deptName,
  });

  return response.data;
};

export const updateDepartment = async (departmentId, deptName) => {
  const response = await api.patch(
    `/departments/${departmentId}`,
    {
      deptName,
    }
  );

  return response.data;
};

export const deleteDepartment = async (departmentId) => {
  const response = await api.delete(
    `/departments/${departmentId}`
  );

  return response.data;
};