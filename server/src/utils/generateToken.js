import jwt from "jsonwebtoken";
import env from "../config/env.js";
import crypto from "crypto"

const generateAccessToken = (user) => {
  const payload = {
    userId: user.userId,
    email: user.email,
    role: user.role,
    // JWT Token ID , mainly used for blacklisting in redis after the session is over.
    // because every token has a TTL(Token Time Limit)
    jti : crypto.randomUUID(),
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