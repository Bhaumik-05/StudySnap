const titleRegex = /^[A-Za-z0-9]+(?:[ :&'().,-][A-Za-z0-9]+)*$/;
const integerRegex = /^[1-9][0-9]*$/;

export const validateNote = (req, res, next) => {
    const {
        title,
        semester,
        deptId,
        subjectId
    } = req.body;

    // Title
    if (!title || typeof title !== "string") {
        return res.status(400).json({
            success: false,
            message: "Title is required"
        });
    }

    const normalizedTitle = title.trim();

    if (!titleRegex.test(normalizedTitle)) {
        return res.status(400).json({
            success: false,
            message: "Invalid title format"
        });
    }

    if (normalizedTitle.length < 2 || normalizedTitle.length > 150) {
        return res.status(400).json({
            success: false,
            message: "Title must be between 2 and 150 characters"
        });
    }

    // Semester
    if (!semester) {
        return res.status(400).json({
            success: false,
            message: "Semester is required"
        });
    }

    if (
        typeof semester !== "string" ||
        !integerRegex.test(semester)
    ) {
        return res.status(400).json({
            success: false,
            message: "Semester must be a positive integer"
        });
    }

    const semesterNumber = Number(semester);

    if (semesterNumber < 1 || semesterNumber > 8) {
        return res.status(400).json({
            success: false,
            message: "Semester must be between 1 and 8"
        });
    }

    // Department ID
    if (!deptId) {
        return res.status(400).json({
            success: false,
            message: "Department ID is required"
        });
    }

    if (!integerRegex.test(String(deptId))) {
        return res.status(400).json({
            success: false,
            message: "Department ID must be a positive integer"
        });
    }

    // Subject ID
    if (!subjectId) {
        return res.status(400).json({
            success: false,
            message: "Subject ID is required"
        });
    }

    if (!integerRegex.test(String(subjectId))) {
        return res.status(400).json({
            success: false,
            message: "Subject ID must be a positive integer"
        });
    }

    // PDF
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "PDF file is required"
        });
    }

    req.body.title = normalizedTitle;
    req.body.semester = semesterNumber;
    req.body.deptId = Number(deptId);
    req.body.subjectId = Number(subjectId);

    next();
};