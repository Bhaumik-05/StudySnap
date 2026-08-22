import express from "express";

import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from "../controller/DepartmentController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getDepartments);
router.post("/", authMiddleware, roleMiddleware("ADMIN"), createDepartment);
router.patch("/:id", authMiddleware, roleMiddleware("ADMIN"), updateDepartment);
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteDepartment);

export default router;