import jwt from "jsonwebtoken";
import env from "../config/env.js";

const generateAccessToken = (user) => {
  const payload = {
    userId: user.userId,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(
    payload,
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    }
  );
};

const generateRefreshToken = (user) => {
  const payload = {
    userId: user.userId,
  };

  return jwt.sign(
    payload,
    env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
    }
  );
};

export {
  generateAccessToken,
  generateRefreshToken,
};