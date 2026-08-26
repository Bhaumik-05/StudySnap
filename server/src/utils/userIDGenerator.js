import User from "../models/User.js";

export const generateUserId = async (role) => {
    const prefixMap = {
        ADMIN: "AD",
        FACULTY: "FAC",
        STUDENT: "STU"
    };

    const prefix = prefixMap[role];

    if (!prefix) {
        const error = new Error("Invalid role for user ID generation");
        error.statusCode = 400;
        throw error;
    }

    // Find the last user with this role/prefix
    const lastUser = await User.findOne({
        userId: { $regex: `^${prefix}` }
    }).sort({ createdAt: -1 });

    let nextNumber = 1;

    if (lastUser) {
        // Remove prefix and convert remaining part to number
        const numericPart = lastUser.userId.replace(prefix, "");

        nextNumber = Number(numericPart) + 1;
    }

    // AD001, FAC001, STU001
    return `${prefix}${String(nextNumber).padStart(3, "0")}`;
};