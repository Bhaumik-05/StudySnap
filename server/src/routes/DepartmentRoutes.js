import express from "express";

import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from "../controller/DepartmentController.js";

const router = express.Router();

router.get("/", getDepartments);
router.post("/", createDepartment);
router.patch("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

export default router;