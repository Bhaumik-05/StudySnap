import express from "express";
import { getSubjects, createSubject, updateSubject, deleteSubject } from "../controller/SubjectController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getSubjects);
router.post("/", authMiddleware, roleMiddleware("ADMIN"), createSubject);
router.patch("/:id", authMiddleware, roleMiddleware("ADMIN"), updateSubject);
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteSubject);

export default router;