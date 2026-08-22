import { getSubjectsService, createSubjectService, updateSubjectService, deleteSubjectService } from "../services/SubjectService.js";

export const getSubjects = async (req, res) => {
    try {
        const subjects = await getSubjectsService();
        res.status(200).json(subjects);
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const createSubject = async (req, res) => {
    try {
        const { subjectId, subjectName, deptId } = req.body;
        const subject = await createSubjectService(subjectId, subjectName, deptId);
        res.status(201).json({ message: "Subject created successfully", subject });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const updateSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const { subjectName, deptId } = req.body;
        const subject = await updateSubjectService(id, subjectName, deptId);
        res.status(200).json({ message: "Subject updated successfully", subject });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

export const deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const subject = await deleteSubjectService(id);
        res.status(200).json({ message: "Subject deleted successfully", subject });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};
