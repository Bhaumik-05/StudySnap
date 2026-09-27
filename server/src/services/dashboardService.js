import User from "../models/User.js";
import Note from "../models/Note.js";
import DownloadHistory from "../models/downloadHistory.js";

const getAdminDashboardStats = async () => {
    const [
        totalUsers,
        totalNotes,
        pendingNotes,
        approvedNotes,
        rejectedNotes,
        totalDownloads,
    ] = await Promise.all([
        User.countDocuments(),

        Note.countDocuments(),

        Note.countDocuments({
            status: "pending",
        }),

        Note.countDocuments({
            status: "approved",
        }),

        Note.countDocuments({
            status: "rejected",
        }),

        DownloadHistory.countDocuments(),
    ]);

    return {
        totalUsers,
        totalNotes,
        pendingNotes,
        approvedNotes,
        rejectedNotes,
        totalDownloads,
    };
};

const getUploaderDashboardStats = async (userEmail, userId) => {
    const userNotesFilter = {
        uploadedBy: userEmail,
    };

    const [
        totalNotes,
        pendingNotes,
        approvedNotes,
        rejectedNotes,
        totalDownloads,
    ] = await Promise.all([
        Note.countDocuments(userNotesFilter),

        Note.countDocuments({
            ...userNotesFilter,
            status: "pending",
        }),

        Note.countDocuments({
            ...userNotesFilter,
            status: "approved",
        }),

        Note.countDocuments({
            ...userNotesFilter,
            status: "rejected",
        }),

        DownloadHistory.countDocuments({
            userId,
        }),
    ]);

    return {
        totalNotes,
        pendingNotes,
        approvedNotes,
        rejectedNotes,
        totalDownloads,
    };
};

export const getDashboardStatsService = async ({
    role,
    email,
    userId,
}) => {
    if (role === "ADMIN") {
        return getAdminDashboardStats();
    }

    return getUploaderDashboardStats(email, userId);
};