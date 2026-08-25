const subjectNameRegex = /^[A-Za-z]+(?:[ &-][A-Za-z]+)*$/;
const positiveIntegerRegex = /^[1-9][0-9]*$/;

export const validateCreateSubject = (req, res, next) => {
    const { subjectName, deptId } = req.body;

    // Subject name required
    if (
        subjectName === undefined ||
        subjectName === null ||
        subjectName === ""
    ) {
        return res.status(400).json({
            success: false,
            message: "Subject name is required"
        });
    }

    // Subject name type
    if (typeof subjectName !== "string") {
        return res.status(400).json({
            success: false,
            message: "Subject name must be a string"
        });
    }

    const normalizedSubjectName = subjectName.trim();

    // Subject name format
    if (!subjectNameRegex.test(normalizedSubjectName)) {
        return res.status(400).json({
            success: false,
            message: "Invalid subject name format"
        });
    }

    // Department IDs required
    if (!Array.isArray(deptId) || deptId.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Department ID(s) are required"
        });
    }

    // Validate every department ID
    for (const id of deptId) {
        if (
            typeof id !== "number" ||
            !Number.isInteger(id) ||
            id <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Department IDs must be positive integers"
            });
        }
    }

    req.body.subjectName = normalizedSubjectName;

    next();
};

export const validateUpdateSubject = (req, res, next) => {
    const { subjectName, deptId } = req.body;

    if (
        subjectName === undefined &&
        deptId === undefined
    ) {
        return res.status(400).json({
            success: false,
            message: "At least one field is required for update"
        });
    }

    if (subjectName !== undefined) {

        if (typeof subjectName !== "string") {
            return res.status(400).json({
                success: false,
                message: "Subject name must be a string"
            });
        }

        const normalizedSubjectName = subjectName.trim();

        if (!subjectNameRegex.test(normalizedSubjectName)) {
            return res.status(400).json({
                success: false,
                message: "Invalid subject name format"
            });
        }

        req.body.subjectName = normalizedSubjectName;
    }

    if (deptId !== undefined) {

        if (!Array.isArray(deptId) || deptId.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Department ID(s) must be a non-empty array"
            });
        }

        for (const id of deptId) {
            if (
                typeof id !== "number" ||
                !Number.isInteger(id) ||
                id <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Department IDs must be positive integers"
                });
            }
        }
    }

    next();
};