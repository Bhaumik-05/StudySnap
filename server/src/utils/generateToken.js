import jwt from "jsonwebtoken";
import env from "../config/env.js";

const generateToken = (user) => { 
    const payload = {
        userId: user.userId,
        email: user.email,
        role : user.role,
    };
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
};

export default generateToken;