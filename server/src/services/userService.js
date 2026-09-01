import User from "../models/User.js";
import bcrypt from "bcryptjs";
 // Get user profile
const getProfile = async (userId) => {
  const user = await User.findOne({ userId }).select("-password");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};
// update user profile
const updateProfile = async (userId, updateData) => {
  // 1. Check whether user exists
  const user = await User.findOne({ userId });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Define allowed fields
  const allowedFields = ["name", "mobile", "sem", "password"];

  const requestedFields = Object.keys(updateData);

  // 3. Strictly reject unauthorized fields
  for (const field of requestedFields) {
    if (!allowedFields.includes(field)) {
      const error = new Error(`Cannot update field: ${field}`);
      error.statusCode = 400;
      throw error;
    }
  }

  // 4. Update allowed fields
  if (updateData.name !== undefined) {
    user.name = updateData.name;
  }

  if (updateData.mobile !== undefined) {
    user.mobile = updateData.mobile;
  }

  if (updateData.sem !== undefined) {
    user.sem = updateData.sem;
  }

  // 5. Hash password before saving
  if (updateData.password !== undefined) {
    user.password = await bcrypt.hash(updateData.password, 10);
  }

  // 6. Save changes
  await user.save();

  // 7. Remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;

  return userResponse;
};

export default {
  getProfile,
  updateProfile,
};
