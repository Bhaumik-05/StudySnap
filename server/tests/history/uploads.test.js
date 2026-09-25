import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";

import app from "../../src/app.js";
import {
    getUserUploadHistoryService,
} from "../../src/services/noteService.js";

vi.mock("../../src/services/noteService.js", () => ({
    getUserUploadHistoryService: vi.fn(),
}));

vi.mock("../../src/middleware/authMiddleware.js", () => ({
    default: (req, res, next) => {
        req.user = {
            userId: "STU001",
            email: "bhaumik@example.com",
            role: "STUDENT",
            jti: "mock-upload-jti",
        };

        next();
    },
}));

describe("User Upload History", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // =========================================================
    // GET /users/uploads
    // =========================================================

    it("should fetch the authenticated user's upload history successfully", async () => {
        const notes = [
            {
                noteId: 101,
                title: "Data Structures",
                uploadedBy: "bhaumik@example.com",
            },
            {
                noteId: 102,
                title: "Operating Systems",
                uploadedBy: "bhaumik@example.com",
            },
        ];

        getUserUploadHistoryService.mockResolvedValue(notes);

        const response = await request(app)
            .get("/users/uploads")
            .set(
                "Authorization",
                "Bearer mock-access-token"
            );

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            success: true,
            count: 2,
            data: notes,
        });
    });

    it("should return the correct upload count", async () => {
        const notes = [
            {
                noteId: 101,
                title: "Data Structures",
            },
            {
                noteId: 102,
                title: "Operating Systems",
            },
            {
                noteId: 103,
                title: "Database Systems",
            },
        ];

        getUserUploadHistoryService.mockResolvedValue(notes);

        const response = await request(app)
            .get("/users/uploads")
            .set(
                "Authorization",
                "Bearer mock-access-token"
            );

        expect(response.status).toBe(200);
        expect(response.body.count).toBe(3);
    });

    it("should return an empty upload history when the user has no uploads", async () => {
        getUserUploadHistoryService.mockResolvedValue([]);

        const response = await request(app)
            .get("/users/uploads")
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

    it("should pass the authenticated user's email to the service", async () => {
        getUserUploadHistoryService.mockResolvedValue([]);

        const response = await request(app)
            .get("/users/uploads")
            .set(
                "Authorization",
                "Bearer mock-access-token"
            );

        expect(response.status).toBe(200);

        expect(
            getUserUploadHistoryService
        ).toHaveBeenCalledTimes(1);

        expect(
            getUserUploadHistoryService
        ).toHaveBeenCalledWith(
            "bhaumik@example.com"
        );
    });

    it("should return the notes provided by the service unchanged", async () => {
        const notes = [
            {
                noteId: 501,
                title: "Computer Networks",
                uploadedBy: "bhaumik@example.com",
                status: "approved",
            },
        ];

        getUserUploadHistoryService.mockResolvedValue(notes);

        const response = await request(app)
            .get("/users/uploads")
            .set(
                "Authorization",
                "Bearer mock-access-token"
            );

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(notes);
    });

    it("should return 500 when the upload history service fails unexpectedly", async () => {
        getUserUploadHistoryService.mockRejectedValue(
            new Error("Database failure")
        );

        const response = await request(app)
            .get("/users/uploads")
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

    it("should return the expected response structure", async () => {
        const notes = [
            {
                noteId: 201,
                title: "Machine Learning",
            },
        ];

        getUserUploadHistoryService.mockResolvedValue(notes);

        const response = await request(app)
            .get("/users/uploads")
            .set(
                "Authorization",
                "Bearer mock-access-token"
            );

        expect(response.status).toBe(200);

        expect(response.body).toHaveProperty(
            "success"
        );

        expect(response.body).toHaveProperty(
            "count"
        );

        expect(response.body).toHaveProperty(
            "data"
        );

        expect(response.body.success).toBe(true);
        expect(response.body.count).toBe(1);
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should call the upload history service only once", async () => {
        getUserUploadHistoryService.mockResolvedValue([]);

        const response = await request(app)
            .get("/users/uploads")
            .set(
                "Authorization",
                "Bearer mock-access-token"
            );

        expect(response.status).toBe(200);

        expect(
            getUserUploadHistoryService
        ).toHaveBeenCalledTimes(1);
    });
});