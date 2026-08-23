import {
    getPendingNotesService,getRejectedNotesService,updateNoteStatusService
} from "../services/noteService.js";


export const getPendingNotes = async (req, res) => {
    try {
        const notes = await getPendingNotesService();

        return res.status(200).json({
            success: true,
            count: notes.length,
            data: notes,
        });

    } catch (error) {
        console.error("Get pending notes failed:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to fetch pending notes",
        });
    }
};

export const getRejectedNotes = async (req, res, next) => {
    try {
        const notes = await getRejectedNotesService();

        return res.status(200).json({
            success: true,
            count: notes.length,
            data: notes,
        });

    } catch (error) {
        console.error("Get rejected notes failed:", error);
        next(error);
    }
};

export const updateNoteStatus = async (req, res, next) => {
    try {
        const { id } = req.params;

        const { status, rejectionReason } = req.body;

        // Assuming your auth middleware stores logged-in user here
        const adminEmail = req.user.email;

        const note = await updateNoteStatusService(
            id,
            status,
            rejectionReason,
            adminEmail
        );

        res.status(200).json({
            success: true,
            message: `Note ${status} successfully`,
            note,
        });

    } catch (error) {
        next(error);
    }
};