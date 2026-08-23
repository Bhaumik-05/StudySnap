import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import {
    getUserDownloadHistory,
} from "../controller/downloadHistroyController.js";

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    getUserDownloadHistory
);

export default router;