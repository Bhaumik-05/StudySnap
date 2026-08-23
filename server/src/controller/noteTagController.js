import {
    getUserTaggedNotesService
} from "../services/noteTagService.js";

export const getUserTaggedNotes = async (req, res, next) => {

    try {

        const userId = req.user.userId;

        const notes = await getUserTaggedNotesService(userId);

        return res.status(200).json({
            success: true,
            count: notes.length,
            data: notes,
        });

    } catch (error) {

        console.error(
            "Get user tagged notes failed:",
            error
        );

        next(error);
    }
};