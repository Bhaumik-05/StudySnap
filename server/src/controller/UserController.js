import userService from "../services/userService.js";

// get profile
const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.userId);

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
// update profile
const updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateProfile(
      req.user.userId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
export default {
  getProfile,
  updateProfile,
};