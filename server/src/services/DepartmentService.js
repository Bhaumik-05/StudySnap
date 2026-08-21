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
    const normalizedDeptName = deptName.trim().toLowerCase();
    const existingDepartment = await Department.findOne({ $or: [{ deptId }, { deptName: normalizedDeptName }] });
    if (existingDepartment) {
        const error = new Error("Department with this ID or name already exists");
        error.statusCode = 409;
        throw error;
    }
    const department = new Department({ deptId, deptName: normalizedDeptName });
    await department.save();
    return department;
};

export const getDepartmentsService = async () => {
    return (await Department.find()).toSorted((a, b) => a.deptId - b.deptId);
};

export const updateDepartmentService = async (deptId, deptName) => {

    const department = await Department.findOne({
        deptId: Number(deptId)
    });

    if (!department) {
        const error = new Error("Department not found");
        error.statusCode = 404;
        throw error;
    }

    department.deptName = deptName;

    await department.save();

    return department;
};
export const deleteDepartmentService = async (deptId) => {
    const department = await Department.findOne({
        deptId: Number(deptId)
    });
    if (!department) {
        const error = new Error("Department not found");
        error.statusCode = 404;
        throw error;
    }
    await Department.deleteOne({
        deptId: Number(deptId)
    });
}
