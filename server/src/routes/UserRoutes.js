import { Router } from "express";

import UserController from "../controller/UserController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getUserUploadHistory,
} from "../controller/uploadHistoryController.js";
import { validateUpdateUser } from "../middleware/validation/userValidation.js";

const router = Router();

// get
router.get(
  "/me",
  authMiddleware,
  UserController.getProfile
);
// patch
router.patch(
  "/me",
  authMiddleware,
  validateUpdateUser,
  UserController.updateProfile
);

router.get(
  "/uploads",
  authMiddleware,
  getUserUploadHistory
);

export default router;