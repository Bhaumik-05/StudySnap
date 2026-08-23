import express from "express";
import upload from "../middleware/upload.js";
import {
    createNote, getApprovedNotes,
    getApprovedNotesById, downloadNote
} from "../controller/NoteController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import { getUserTaggedNotes } from "../controller/noteTagController.js"
const router = express.Router();

router.get(
    "/",
    getApprovedNotes
);

router.get(
    "/:noteId/download",
    authMiddleware,
    downloadNote
);

router.patch(
    "/:noteId/tag",
    authMiddleware,
    roleMiddleware("STUDENT", "FACULTY"),
    assignNoteTag
);

router.get(
    "/:noteId",
    getApprovedNotesById
);

router.get(
    "/",
    searchNotes
);

export default router;