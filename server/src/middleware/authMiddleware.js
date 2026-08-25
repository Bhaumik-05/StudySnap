import jwt from "jsonwebtoken";
import env from "../config/env.js";
import { isAccessTokenBlacklisted } from "../utils/tokenBlacklist.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, env.JWT_SECRET);

    // Check whether this specific token was revoked
    const isBlacklisted = await isAccessTokenBlacklisted(decoded.jti);

    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        message: "Access token has been revoked. Please login again.",
      });
    }

    req.user = decoded;

    // Important: keep the actual token for logout
    req.accessToken = token;

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;