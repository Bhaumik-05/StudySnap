import {
    getUserUploadHistoryService,
} from "../services/noteService.js";

export const getUserUploadHistory = async (req, res, next) => {
    try {
        console.log("REQ.USER:", req.user);

        const userEmail = req.user.email;

        const notes = await getUserUploadHistoryService(userEmail);

        return res.status(200).json({
            success: true,
            count: notes.length,
            data: notes,
        });

    } catch (error) {
        console.error("Get upload history failed:", error);
        next(error);
    }
};