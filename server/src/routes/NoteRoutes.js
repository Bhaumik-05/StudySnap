import express from "express";
import upload from "../middleware/upload.js";
import { createNote } from "../controller/NoteController.js";

const router = express.Router();

router.post(
    "/",
    upload.single("pdf"),
    createNote
);

export default router;