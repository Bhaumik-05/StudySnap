import { Router } from "express";

import UserController from "../controller/UserController.js";
import authMiddleware from "../middleware/authMiddleware.js";

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

export default router;