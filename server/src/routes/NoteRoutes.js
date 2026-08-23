import express from "express";
import upload from "../middleware/upload.js";
import {
    createNote, getApprovedNotes, getPendingNotes,
    getApprovedNotesById, getRejectedNotes, downloadNote
} from "../controller/NoteController.js";
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

router.get(
    "/",
    getApprovedNotes
);

router.get(
    "/pending",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getPendingNotes
);
router.get(
    "/rejected",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getRejectedNotes
);
router.get(
    "/:noteId/download",
    authMiddleware,
    downloadNote
);
router.get(
    "/:noteId",
    getApprovedNotesById
);

export default router;