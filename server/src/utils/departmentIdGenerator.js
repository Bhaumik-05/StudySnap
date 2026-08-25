import Department from "../models/Department.js";

export const generateDepartmentId = async () => {
    const lastDepartment = await Department
        .findOne()
        .sort({ deptId: -1 })
        .select("deptId");

    if (!lastDepartment) {
        return 1;
    }

    return lastDepartment.deptId + 1;
};