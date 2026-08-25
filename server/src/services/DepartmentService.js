import Department from "../models/Department.js";
import { generateDepartmentId } from "../utils/departmentIdGenerator.js";

export const createDepartmentService = async (deptName) => {

    const normalizedDeptName = deptName.trim().toLowerCase();

    // Check only department name
    const existingDepartment = await Department.findOne({
        deptName: normalizedDeptName
    });

    if (existingDepartment) {
        const error = new Error(
            "Department with this name already exists"
        );

        error.statusCode = 409;
        throw error;
    }

    // Generate department ID
    const deptId = await generateDepartmentId();

    // Create department
    const department = new Department({
        deptId,
        deptName: normalizedDeptName
    });

    await department.save();

    return department;
};

export const getDepartmentsService = async () => {
    return (await Department.find()).toSorted((a, b) => a.deptId - b.deptId);
};

export const updateDepartmentService = async (deptId, deptName) => {
    const normalizedDeptName = deptName.trim().toLowerCase();
    const department = await Department.findOne({
        deptId: Number(deptId)
    });

    if (!department) {
        const error = new Error("Department not found");
        error.statusCode = 404;
        throw error;
    }

    department.deptName = normalizedDeptName;

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