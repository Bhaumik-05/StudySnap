import { createDepartmentService, getDepartmentsService } from "../services/DepartmentService.js";
export const createDepartment = async (req, res) => {
    try {
        const { deptId, deptName } = req.body;
        const department = await createDepartmentService(deptId, deptName);
        res.status(201).json({ message: "Department created successfully", department });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
}

export const getDepartments = async (req, res) => {
    try {
        const departments = await getDepartmentsService();
        res.status(200).json({ departments });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
}
