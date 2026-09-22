const subjectNameRegex = /^[A-Za-z]+(?:[ &-][A-Za-z]+)*$/;
const positiveIntegerRegex = /^[1-9][0-9]*$/;

// Convert department ID to a positive integer
const toValidPositiveInt = (id) => {
    const n = Number(id);

    return Number.isInteger(n) && n > 0 ? n : null;
};

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

    // Validate and normalize every department ID
    const normalizedDeptIds = [];

    for (const id of deptId) {
        const n = toValidPositiveInt(id);

        if (n === null) {
            return res.status(400).json({
                success: false,
                message: "Department IDs must be positive integers"
            });
        }

        normalizedDeptIds.push(n);
    }

    req.body.subjectName = normalizedSubjectName;
    req.body.deptId = normalizedDeptIds;

    next();
};


export const validateUpdateSubject = (req, res, next) => {
    const { subjectName, deptId } = req.body;

    // At least one field required
    if (
        subjectName === undefined &&
        deptId === undefined
    ) {
        return res.status(400).json({
            success: false,
            message: "At least one field is required for update"
        });
    }

    // Validate subject name if provided
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

    // Validate department IDs if provided
    if (deptId !== undefined) {

        if (!Array.isArray(deptId) || deptId.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Department ID(s) must be a non-empty array"
            });
        }

        // Validate and normalize every department ID
        const normalizedDeptIds = [];

        for (const id of deptId) {
            const n = toValidPositiveInt(id);

            if (n === null) {
                return res.status(400).json({
                    success: false,
                    message: "Department IDs must be positive integers"
                });
            }

            normalizedDeptIds.push(n);
        }

        req.body.deptId = normalizedDeptIds;
    }

    next();
};
