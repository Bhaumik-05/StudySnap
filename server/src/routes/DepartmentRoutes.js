import express from "express";

import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from "../controller/DepartmentController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import { validateDepartmentName } from "../middleware/validation/departmentValidation.js"

const router = express.Router();

router.get("/", getDepartments);
router.post("/", authMiddleware, roleMiddleware("ADMIN"), validateDepartmentName, createDepartment);
router.patch("/:id", authMiddleware, roleMiddleware("ADMIN"), validateDepartmentName, updateDepartment);
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteDepartment);

export default router;