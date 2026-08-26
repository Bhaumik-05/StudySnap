import {Router} from "express";
import authController from "../controller/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

import {
    validateRegisterUser,
    validateLoginUser
} from "../middleware/validation/userValidation.js";

const router = Router();

router.post("/register", validateRegisterUser, authController.register);
router.post("/login", validateLoginUser, authController.login);
router.post("/logout",authMiddleware,authController.logout);
router.post("/refresh", authController.refresh);

export default router;