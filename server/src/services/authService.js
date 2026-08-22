import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Department from "../models/Department.js";
import generateToken from "../utils/generatetoken.js";
// 1) Register a new user
const registerUser = async (userData) => {
  const{
    userId,
    name,
    email,
    password,
    role,
    sem,
    mobile,
    deptId,
  } = userData;

  // Check if the user is already there.
    const existingUserId = await User.findOne({ userId : Number(userId) });
    if(existingUserId) {
        const error = new Error("UserId already exists");
        error.statusCode = 400;
        throw error;
    }
     // Check if the email is already there.
    const existingEmail = await User.findOne({ email });
    if(existingEmail) {
        const error = new Error("Email already exists");
        error.statusCode = 400;
        throw error;
    }

    // Only check for a department if the user being registered is NOT an ADMIN
    if (role !== 'ADMIN') {
      if (!deptId) {
        const error = new Error("Department ID is required for non-admin users");
        error.statusCode = 400;
        throw error;
      }

      const department = await Department.findOne({ deptId: Number(deptId) });
      if (!department) {
        const error = new Error("Department does not exist");
        error.statusCode = 400;
        throw error;
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a user
    const user = await User.create({
        userId,
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
  // Find user using email
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("Invalid email");
    error.statusCode = 400;
    throw error;
  }

  // Compare entered password with hashed password
  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordCorrect) {
    const error = new Error("Invalid password");
    error.statusCode = 400;
    throw error;
  }

  // Generate JWT
  const token = generateToken(user);

  // Remove password before sending response
  const userResponse = user.toObject();
  delete userResponse.password;

  return {
    user: userResponse,
    token,
  };
};

const logoutUser = async () => {
  return {
    message: "Logout successful",
  };
};

export default {
    registerUser,
    loginUser,
    logoutUser,
};
