import express from "express";

import { getDepartments, createDepartment } from "../controller/DepartmentController.js";

const router = express.Router();

router.get("/", getDepartments);
router.post("/", createDepartment);

export default router;