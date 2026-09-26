import api from "./client";

export const getDepartments = async () => {
    const response = await api.get("/departments");
    return response.data?.departments ?? [];
};

export const createDepartment = async (departmentData) => {
    return await api.post("/departments", departmentData);
};

export const updateDepartment = async (departmentId, departmentData) => {
    return await api.patch(
        `/departments/${departmentId}`,
        departmentData,
    );
};

export const deleteDepartment = async (departmentId) => {
    return await api.delete(
        `/departments/${departmentId}`,
    );
};