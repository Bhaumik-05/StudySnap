import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";

import app from "../../src/app.js";
import {
    getUserDownloadHistoryService,
} from "../../src/services/downloadHistoryService.js";

vi.mock("../../src/services/downloadHistoryService.js", () => ({
    getUserDownloadHistoryService: vi.fn(),
}));

vi.mock("../../src/middleware/authMiddleware.js", () => ({
    default: (req, res, next) => {
        req.user = {
            userId: "STU001",
            email: "bhaumik@example.com",
            role: "STUDENT",
            jti: "mock-download-jti",
        };

        next();
    },
}));

describe("User Download History", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // =========================================================
    // GET /downloads/
    // =========================================================

    it("should fetch the authenticated user's download history successfully", async () => {
        const history = [
            {
                noteId: 101,
                title: "Data Structures",
                description: "DSA notes",
                semester: 5,
                deptId: 1,
                subjectId: 10,
                pdfUrl: "https://example.com/ds.pdf",
                downloadDate: "2026-09-25T10:00:00.000Z",
            },
            {
                noteId: 102,
                title: "Operating Systems",
                description: "OS notes",
                semester: 5,
                deptId: 1,
                subjectId: 11,
                pdfUrl: "https://example.com/os.pdf",
                downloadDate: "2026-09-24T10:00:00.000Z",
            },
        ];

        getUserDownloadHistoryService.mockResolvedValue(history);

        const response = await request(app)
            .get("/downloads/")
            .set(
                "Authorization",
                "Bearer mock-access-token"
            );

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            success: true,
            count: 2,
            data: history,
        });
    });

    it("should pass the authenticated user's ID to the service", async () => {
        getUserDownloadHistoryService.mockResolvedValue([]);

        const response = await request(app)
            .get("/downloads/")
            .set(
                "Authorization",
                "Bearer mock-access-token"
            );

        expect(response.status).toBe(200);

        expect(
            getUserDownloadHistoryService
        ).toHaveBeenCalledTimes(1);

        expect(
            getUserDownloadHistoryService
        ).toHaveBeenCalledWith("STU001");
    });

    it("should return the correct download count", async () => {
        const history = [
            { noteId: 101, title: "Data Structures" },
            { noteId: 102, title: "Operating Systems" },
            { noteId: 103, title: "DBMS" },
        ];

        getUserDownloadHistoryService.mockResolvedValue(history);

        const response = await request(app)
            .get("/downloads/")
            .set(
                "Authorization",
                "Bearer mock-access-token"
            );

        expect(response.status).toBe(200);
        expect(response.body.count).toBe(3);
    });

    it("should return an empty download history when the user has no downloads", async () => {
        getUserDownloadHistoryService.mockResolvedValue([]);

        const response = await request(app)
            .get("/downloads/")
            .set(
                "Authorization",
                "Bearer mock-access-token"
            );

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            success: true,
            count: 0,
            data: [],
        });
    });

    it("should return the download history provided by the service unchanged", async () => {
        const history = [
            {
                noteId: 501,
                title: "Computer Networks",
                description: "CN notes",
                semester: 6,
                deptId: 2,
                subjectId: 20,
                pdfUrl: "https://example.com/cn.pdf",
                downloadDate: "2026-09-25T12:00:00.000Z",
            },
        ];

        getUserDownloadHistoryService.mockResolvedValue(history);

        const response = await request(app)
            .get("/downloads/")
            .set(
                "Authorization",
                "Bearer mock-access-token"
            );

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(history);
    });

    it("should return the expected response structure", async () => {
        const history = [
            {
                noteId: 201,
                title: "Machine Learning",
                downloadDate: "2026-09-25T08:00:00.000Z",
            },
        ];

        getUserDownloadHistoryService.mockResolvedValue(history);

        const response = await request(app)
            .get("/downloads/")
            .set(
                "Authorization",
                "Bearer mock-access-token"
            );

        expect(response.status).toBe(200);

        expect(response.body).toHaveProperty("success");
        expect(response.body).toHaveProperty("count");
        expect(response.body).toHaveProperty("data");

        expect(response.body.success).toBe(true);
        expect(response.body.count).toBe(1);
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should return 500 when the download history service fails unexpectedly", async () => {
        getUserDownloadHistoryService.mockRejectedValue(
            new Error("Database failure")
        );

        const response = await request(app)
            .get("/downloads/")
            .set(
                "Authorization",
                "Bearer mock-access-token"
            );

        expect(response.status).toBe(500);

        expect(response.body).toEqual({
            success: false,
            message: "Database failure",
        });
    });

    it("should call the download history service only once", async () => {
        getUserDownloadHistoryService.mockResolvedValue([]);

        const response = await request(app)
            .get("/downloads/")
            .set(
                "Authorization",
                "Bearer mock-access-token"
            );

        expect(response.status).toBe(200);

        expect(
            getUserDownloadHistoryService
        ).toHaveBeenCalledTimes(1);
    });
});