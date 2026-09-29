import Department from "../models/Department.js";
import { generateDepartmentId } from "../utils/departmentIdGenerator.js";
import User from "../models/User.js";
import Note from "../models/Note.js";

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
    const [departments, userCounts, approvedNoteCounts] =
        await Promise.all([
            Department.find().lean(),

            // Count users in each department
            User.aggregate([
                {
                    $match: {
                        deptId: {
                            $exists: true,
                            $ne: null
                        }
                    }
                },
                {
                    $group: {
                        _id: "$deptId",
                        count: {
                            $sum: 1
                        }
                    }
                }
            ]),

            // Count approved notes in each department
            Note.aggregate([
                {
                    $match: {
                        status: "approved"
                    }
                },
                {
                    $group: {
                        _id: "$deptId",
                        count: {
                            $sum: 1
                        }
                    }
                }
            ])
        ]);

    // Convert user counts into:
    // deptId -> count
    const userCountMap = new Map(
        userCounts.map((item) => [
            item._id,
            item.count
        ])
    );

    // Convert approved note counts into:
    // deptId -> count
    const approvedNoteCountMap = new Map(
        approvedNoteCounts.map((item) => [
            item._id,
            item.count
        ])
    );

    // Add counts to every department
    return departments
        .map((department) => ({
            ...department,

            userCount:
                userCountMap.get(department.deptId) || 0,

            approvedNotesCount:
                approvedNoteCountMap.get(department.deptId) || 0
        }))
        .sort(
            (a, b) =>
                a.deptId - b.deptId
        );
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