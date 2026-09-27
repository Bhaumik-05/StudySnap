import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import {
    getDashboardStats,
} from "../controller/DashboardController.js";

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    getDashboardStats
);

export default router;