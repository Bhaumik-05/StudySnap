import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Department from "../models/Department.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import Session from "../models/Session.js";
import { convertToMilliseconds } from "../config/env.js";
import env from "../config/env.js";
import jwt from "jsonwebtoken";
import { blacklistAccessToken } from "../utils/tokenBlacklist.js";
import { generateUserId } from "../utils/userIDGenerator.js";

// 1) Register a new user
const registerUser = async (userData) => {
  const{
    name,
    email,
    password,
    role,
    sem,
    mobile,
    deptId,
  } = userData;

  // // Check if the user is already there.
  //   const existingUserId = await User.findOne({ userId });
  //   if(existingUserId) {
  //       const error = new Error("UserId already exists");
  //       error.statusCode = 400;
  //       throw error;
  //   }

     // Check if the email is already there.
    const existingEmail = await User.findOne({ email });
    if(existingEmail) {
        const error = new Error("Email already exists");
        error.statusCode = 409;
        throw error;
    }

    // Only check for a department if the user being registered is NOT an ADMIN
    if (role !== 'ADMIN') {
      if (!deptId) {
        const error = new Error("Department ID is required for non-admin users");
        error.statusCode = 404;
        throw error;
      }

      const department = await Department.findOne({ deptId: Number(deptId) });
      if (!department) {
        const error = new Error("Department does not exist");
        error.statusCode = 400;
        throw error;
      }
    }

    // Generate a unique userId based on the role
    const generatedUserId = await generateUserId(role);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a user
    const user = await User.create({
        userId: generatedUserId,
        name,
        email,
        password: hashedPassword,
        role,
        sem,
        mobile,
        deptId,
    });

    // Remove password before returning
    const userResponse = user.toObject();
    delete userResponse.password;

    return userResponse;
    };

// 2) Login user

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  // Generate access token
  const accessToken = generateAccessToken(user);

  // Generate refresh token
  const refreshToken = generateRefreshToken(user);

  // Calculate session expiry from environment configuration
  const expiresAt = new Date(
    Date.now() +
      convertToMilliseconds(env.REFRESH_TOKEN_EXPIRES_IN)
  );

  // Create session
  await Session.create({
    userId: user.userId,
    refreshToken,
    expiresAt,
  });

  // Remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;

  return {
    user: userResponse,
    accessToken,
    refreshToken,
  };
};

// // logout
// const logoutUser = async (refreshToken) => {
//   if (!refreshToken) {
//     const error = new Error("No active session found");
//     error.statusCode = 401;
//     throw error;
//   }

//   const session = await Session.findOne({ refreshToken });

//   // Session doesn't exist = already logged out or invalid session
//   if (!session) {
//     const error = new Error("Session not found or already logged out");
//     error.statusCode = 401;
//     throw error;
//   }

//   // Delete the active session
//   await Session.deleteOne({
//     _id: session._id,
//   });

//   return {
//     message: "Logout successful",
//   };
// };

// new logout user with blacklisting access token

// logout

const logoutUser = async (refreshToken, decodedAccessToken) => {
  // Check refresh token
  if (!refreshToken) {
    const error = new Error("No active session found");
    error.statusCode = 401;
    throw error;
  }

  // Check access token data
  if (!decodedAccessToken || !decodedAccessToken.jti) {
    const error = new Error("Invalid access token");
    error.statusCode = 401;
    throw error;
  }

  // Find active session
  const session = await Session.findOne({ refreshToken });

  // Session doesn't exist = already logged out or invalid session
  if (!session) {
    const error = new Error(
      "Session not found or already logged out"
    );
    error.statusCode = 401;
    throw error;
  }

  // Calculate remaining access-token lifetime
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);

  const remainingTime =
    decodedAccessToken.exp - currentTimeInSeconds;

  // Blacklist access token only if it still has time remaining
  if (remainingTime > 0) {
    await blacklistAccessToken(
      decodedAccessToken.jti,
      remainingTime
    );
  }

  // Delete the active session
  await Session.deleteOne({
    _id: session._id,
  });

  return {
    message: "Logout successful",
  };
};

// refresh the access token

const refreshAccessToken = async (refreshToken) => {
  // 1. Check if refresh token exists
  if (!refreshToken) {
    const error = new Error("Refresh token is required");
    error.statusCode = 401;
    throw error;
  }

  // 2. Verify the refresh token JWT
  let decoded;

  try {
    decoded = jwt.verify(
      refreshToken,
      env.REFRESH_TOKEN_SECRET
    );
  } catch (error) {
    const tokenError = new Error("Invalid or expired refresh token");
    tokenError.statusCode = 401;
    throw tokenError;
  }

  // 3. Check if the session exists in MongoDB
  const session = await Session.findOne({
    refreshToken,
  });

  if (!session) {
    const error = new Error("Session not found or has been logged out");
    error.statusCode = 401;
    throw error;
  }

  // 4. Check session expiry
  if (session.expiresAt < new Date()) {
    await Session.deleteOne({
      _id: session._id,
    });

    const error = new Error("Session has expired");
    error.statusCode = 401;
    throw error;
  }

  // 5. Find the user
  const user = await User.findOne({
    userId: decoded.userId,
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // 6. Generate a new access token
  const accessToken = generateAccessToken(user);

  return {
    accessToken,
  };
};

export default {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
};
