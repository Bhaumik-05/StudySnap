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

    // Store refresh token in HTTP-only cookie
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    // we should change this during production 
    /*
    res.cookie("refreshToken", result.refreshToken, { // this are the security settings. object
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });
    */

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// logout user
const logout = async (req, res, next) => {
  try {
    // Refresh token comes from HTTP-only cookie
    const refreshToken = req.cookies.refreshToken;

    // req.user comes from authMiddleware
    const result = await authService.logoutUser(
      refreshToken,
      req.user
    );

    // Remove refresh token cookie
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    return res.status(200).json({
      success: true,
      message: result.message,
    });

  } catch (error) {
    next(error);
  }
};

// Refresh access token
const refresh = async (req, res, next) => {
  try {
    // Get refresh token from HTTP-only cookie
    const refreshToken = req.cookies.refreshToken;

    const result = await authService.refreshAccessToken(refreshToken);

    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
    export default {
    register,
    login,
    logout,
    refresh,
};