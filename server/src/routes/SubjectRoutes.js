import express from "express";
import { getSubjects, createSubject, updateSubject, deleteSubject } from "../controller/SubjectController.js";

const router = express.Router();

router.get("/", getSubjects);
router.post("/", createSubject);
router.patch("/:id", updateSubject);
router.delete("/:id", deleteSubject);

export default router;