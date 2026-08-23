import {
    getUserDownloadHistoryService,
} from "../services/downloadHistoryService.js";

export const getUserDownloadHistory = async (req, res, next) => {
    try {
        // Get userId from authenticated user
        const userId = req.user.userId;

        const history = await getUserDownloadHistoryService(userId);

        return res.status(200).json({
            success: true,
            count: history.length,
            data: history,
        });

    } catch (error) {
        console.error("Get download history failed:", error);

        next(error);
    }
};