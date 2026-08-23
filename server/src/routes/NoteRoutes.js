import express from "express";
import upload from "../middleware/upload.js";
import { createNote } from "../controller/NoteController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    roleMiddleware("FACULTY", "STUDENT"),
    upload.single("pdf"),
    createNote
);

export default router;