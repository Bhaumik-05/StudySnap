import express from "express";
import upload from "../middleware/upload.js";
import {
    createNote, getApprovedNotes, getPendingNotes,
    getApprovedNotesById, getRejectedNotes
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
    "/:noteId",
    getApprovedNotesById
);

router.get(
    "/rejected",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getRejectedNotes
);
export default router;