// Regex patterns

// const userIdRegex = /^[A-Za-z0-9_-]+$/;

const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const mobileRegex = /^[0-9]{10}$/;

// Minimum 8 chars, uppercase, lowercase, number, special character
const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


// ==========================================
// REGISTER USER VALIDATION
// ==========================================

export const validateRegisterUser = (req, res, next) => {

    const {
        userId,
        name,
        email,
        password,
        role,
        sem,
        mobile,
        deptId
    } = req.body;


    // // USER ID
    // if (!userId || typeof userId !== "string") {
    //     return res.status(400).json({
    //         success: false,
    //         message: "User ID is required"
    //     });
    // }

    // if (!userIdRegex.test(userId.trim())) {
    //     return res.status(400).json({
    //         success: false,
    //         message: "Invalid User ID format"
    //     });
    // }


    // NAME
    if (!name || typeof name !== "string") {
        return res.status(400).json({
            success: false,
            message: "Name is required"
        });
    }

    if (!nameRegex.test(name.trim())) {
        return res.status(400).json({
            success: false,
            message: "Invalid name format"
        });
    }


    // EMAIL
    if (!email || typeof email !== "string") {
        return res.status(400).json({
            success: false,
            message: "Email is required"
        });
    }

    if (!emailRegex.test(email.trim())) {
        return res.status(400).json({
            success: false,
            message: "Invalid email format"
        });
    }


    // PASSWORD
    if (!password || typeof password !== "string") {
        return res.status(400).json({
            success: false,
            message: "Password is required"
        });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            success: false,
            message:
                "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
        });
    }


    // ROLE
    const allowedRoles = ["STUDENT", "FACULTY", "ADMIN"];

    if (!role || !allowedRoles.includes(role)) {
        return res.status(400).json({
            success: false,
            message: "Role must be STUDENT, FACULTY, or ADMIN"
        });
    }


    // SEMESTER
    // Required only for STUDENT
    if (role === "STUDENT") {

        if (
            sem === undefined ||
            !Number.isInteger(Number(sem)) ||
            Number(sem) < 1 ||
            Number(sem) > 8
        ) {
            return res.status(400).json({
                success: false,
                message: "Semester must be an integer between 1 and 8"
            });
        }
    }


    // MOBILE
    if (mobile !== undefined && mobile !== null) {

        if (
            typeof mobile !== "string" ||
            !mobileRegex.test(mobile.trim())
        ) {
            return res.status(400).json({
                success: false,
                message: "Mobile number must contain exactly 10 digits"
            });
        }
    }


    // DEPARTMENT
    // Required for STUDENT and FACULTY
    if (role !== "ADMIN") {

        if (
            deptId === undefined ||
            !Number.isInteger(Number(deptId)) ||
            Number(deptId) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid Department ID is required"
            });
        }
    }


    // Normalize data

    // req.body.userId = userId.trim();

    req.body.name = name.trim();

    req.body.email = email.trim().toLowerCase();

    req.body.role = role;

    if (mobile) {
        req.body.mobile = mobile.trim();
    }

    if (sem !== undefined) {
        req.body.sem = Number(sem);
    }

    if (deptId !== undefined) {
        req.body.deptId = Number(deptId);
    }


    next();
};


// ==========================================
// LOGIN USER VALIDATION
// ==========================================

export const validateLoginUser = (req, res, next) => {

    const { email, password } = req.body;


    // EMAIL
    if (!email || typeof email !== "string") {
        return res.status(400).json({
            success: false,
            message: "Email is required"
        });
    }

    if (!emailRegex.test(email.trim())) {
        return res.status(400).json({
            success: false,
            message: "Invalid email format"
        });
    }


    // PASSWORD
    if (!password || typeof password !== "string") {
        return res.status(400).json({
            success: false,
            message: "Password is required"
        });
    }


    // Normalize email
    req.body.email = email.trim().toLowerCase();

    next();
};


// ==========================================
// UPDATE USER VALIDATION
// ==========================================

export const validateUpdateUser = (req, res, next) => {

    const { name, mobile, sem, password } = req.body;


    // Check if request body is empty
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            success: false,
            message: "At least one field is required for update"
        });
    }


    // NAME
    if (name !== undefined) {

        if (
            typeof name !== "string" ||
            !nameRegex.test(name.trim())
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid name format"
            });
        }

        req.body.name = name.trim();
    }


    // MOBILE
    if (mobile !== undefined) {

        if (
            typeof mobile !== "string" ||
            !mobileRegex.test(mobile.trim())
        ) {
            return res.status(400).json({
                success: false,
                message: "Mobile number must contain exactly 10 digits"
            });
        }

        req.body.mobile = mobile.trim();
    }


    // SEMESTER
    if (sem !== undefined) {

        if (
            !Number.isInteger(Number(sem)) ||
            Number(sem) < 1 ||
            Number(sem) > 8
        ) {
            return res.status(400).json({
                success: false,
                message: "Semester must be an integer between 1 and 8"
            });
        }

        req.body.sem = Number(sem);
    }


    // PASSWORD
    if (password !== undefined) {

        if (
            typeof password !== "string" ||
            !passwordRegex.test(password)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
            });
        }
    }


    next();
};