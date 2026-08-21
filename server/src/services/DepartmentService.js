import Department from "../models/Department.js";

export const createDepartmentService = async (deptId, deptName) => {
    if (!deptId) {
        const error = new Error("Department ID is required");
        error.statusCode = 400;
        throw error;
    }
    if (!deptName) {
        const error = new Error("Department name is required");
        error.statusCode = 400;
        throw error;
    }
    const existingDepartment = await Department.findOne({ $or: [{ deptId }, { deptName }] });
    if (existingDepartment) {
        const error = new Error("Department with this ID or name already exists");
        error.statusCode = 409;
        throw error;
    }
    const department = new Department({ deptId, deptName });
    await department.save();
    return department;
};

export const getDepartmentsService = async () => {
    return (await Department.find()).toSorted((a, b) => a.deptId - b.deptId);
};