import {
    getDashboardStatsService,
} from "../services/dashboardService.js";

export const getDashboardStats = async (req, res, next) => {
    try {
        const stats = await getDashboardStatsService({
            role: req.user.role,
            email: req.user.email,
            userId: req.user.userId,
        });

        return res.status(200).json(stats);
    } catch (error) {
        next(error);
    }
};