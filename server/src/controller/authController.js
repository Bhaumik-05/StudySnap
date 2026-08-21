import authService from "../services/authService.js";
// Register a new user
const register = async (req, res , next) => {
    try {
    const user = await authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
// login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser(email, password);
    delete result.password; // Remove password from the response

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
// logout user
const logout = async (req, res, next) => {
  try {
    const result = await authService.logoutUser();

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};
    export default {
    register,
    login,
    logout
};