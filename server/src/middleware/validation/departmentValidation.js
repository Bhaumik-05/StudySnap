const deptNameRegex = /^[A-Za-z]+(?:[ &-][A-Za-z]+)*$/;

export const validateDepartmentName = (req, res, next) => {
    console.log("VALIDATION MIDDLEWARE REACHED");

    const { deptName } = req.body;

    if (!deptName || typeof deptName !== "string") {
        return res.status(400).json({
            success: false,
            message: "Department name is required"
        });
    }

    const normalizedDeptName = deptName.trim();

    if (!deptNameRegex.test(normalizedDeptName)) {
        return res.status(400).json({
            success: false,
            message: "Invalid department name format"
        });
    }

    req.body.deptName = normalizedDeptName;

    next();
};