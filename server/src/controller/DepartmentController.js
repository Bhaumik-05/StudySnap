import { createDepartmentService, getDepartmentsService, updateDepartmentService, deleteDepartmentService } from "../services/DepartmentService.js";
export const createDepartment = async (req, res) => {
    try {
        const { deptName } = req.body;
        const department = await createDepartmentService(deptName);
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
export const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { deptName } = req.body;

        const department = await updateDepartmentService(
            id,
            deptName
        );

        return res.status(200).json({
            message: "Department updated successfully",
            department
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error"
        });
    }
};

export const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;

        await deleteDepartmentService(id);

        return res.status(200).json({
            message: "Department deleted successfully"
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error"
        });
    }
};