import Subject from "../models/Subject.js";
import Department from "../models/Department.js";
import { generateSubjectId } from "../utils/subjectIdGenerator.js";
export const getSubjectsService = async () => {
    return (await Subject.find()).toSorted((a, b) => a.subjectId - b.subjectId);
}

export const createSubjectService = async (subjectName, deptId) => {

    // Convert every department ID to Number
    const departmentIds = deptId.map(id => Number(id));

    // Check if all departments exist
    const departments = await Department.find({
        deptId: { $in: departmentIds }
    });

    // Extract department IDs from database
    const existingDeptIds = departments.map(
        department => department.deptId
    );

    // Find department IDs that don't exist
    const missingDeptIds = departmentIds.filter(
        id => !existingDeptIds.includes(id)
    );

    // If any department is missing, stop creation
    if (missingDeptIds.length > 0) {
        throw new Error(
            `Department ID(s) not found: ${missingDeptIds.join(", ")}`
        );
    }

    const normalizedSubjectName = subjectName.trim().toLowerCase();

    const existingSubject = await Subject.findOne({
        subjectName: normalizedSubjectName
    });
    if (existingSubject) {
        const error = new Error("Subject with this ID or name already exists");
        error.statusCode = 409;
        throw error;
    }
    const subjectId = await generateSubjectId();
    const subject = new Subject({ subjectId, subjectName: normalizedSubjectName, deptId });
    await subject.save();
    return subject;
};


export const updateSubjectService = async (subjectId, subjectName, deptId) => {
    if (!subjectId) {
        const error = new Error("Subject ID is required");
        error.statusCode = 400;
        throw error;
    }

    const subject = await Subject.findOne({
        subjectId: Number(subjectId)
    });

    if (!subject) {
        const error = new Error("Subject not found");
        error.statusCode = 404;
        throw error;
    }

    if (!subjectName) {
        const error = new Error("Subject name is required");
        error.statusCode = 400;
        throw error;
    }

    if (!deptId || !Array.isArray(deptId) || deptId.length === 0) {
        const error = new Error("Department ID(s) are required");
        error.statusCode = 400;
        throw error;
    }
    // Convert Department IDs to Number
    const departmentIds = deptId.map(id => Number(id));

    // Check whether all Departments exist-
    const departments = await Department.find({
        deptId: { $in: departmentIds }
    });


    // Extract IDs of departments that exist
    const existingDeptIds = departments.map(
        department => department.deptId
    );

    // Find IDs that don't exist
    const missingDeptIds = departmentIds.filter(
        id => !existingDeptIds.includes(id)
    );

    // If any department is missing, stop update
    if (missingDeptIds.length > 0) {
        const error = new Error(
            `Department ID(s) not found: ${missingDeptIds.join(", ")}`
        );
        error.statusCode = 404;
        throw error;
    }

    const normalizedSubjectName = subjectName
        .trim()
        .toLowerCase();

    const existingSubject = await Subject.findOne({
        subjectName: normalizedSubjectName,
        subjectId: {
            $ne: Number(subjectId)
        }
    });

    if (existingSubject) {
        const error = new Error(
            "Another subject with this name already exists"
        );
        error.statusCode = 409;
        throw error;
    }

    subject.subjectName = normalizedSubjectName;
    subject.deptId = departmentIds;

    await subject.save();

    return subject;
};

export const deleteSubjectService = async (subjectId) => {
    const subject = await Subject.findOne({
        subjectId: Number(subjectId)
    });

    if (!subject) {
        const error = new Error("Subject not found");
        error.statusCode = 404;
        throw error;
    }

    await subject.deleteOne();
    return subject;
};