import express from "express";
import { getPendingNotes , getRejectedNotes , updateNoteStatus } from "../controller/adminController.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/notes/pending", authMiddleware , roleMiddleware("ADMIN") , getPendingNotes);
router.get("/notes/rejected" , authMiddleware , roleMiddleware("ADMIN"),getRejectedNotes);
router.patch("/notes/:id/status" , authMiddleware , roleMiddleware("ADMIN") , updateNoteStatus);

export default router;