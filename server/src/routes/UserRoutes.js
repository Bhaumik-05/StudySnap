import { Router } from "express";

import UserController from "../controller/UserController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getUserUploadHistory,
} from "../controller/uploadHistoryController.js";


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
  UserController.updateProfile
);

router.get(
  "/uploads",
  authMiddleware,
  getUserUploadHistory
);

export default router;