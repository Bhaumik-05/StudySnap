import {Router} from "express";
import authController from "../controller/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout",authMiddleware,authController.logout);
router.post("/refresh", authController.refresh);

export default router;