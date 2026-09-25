import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";

import app from "../../src/app.js";

import {
    getPendingNotesService,
    getRejectedNotesService,
    updateNoteStatusService,
} from "../../src/services/noteService.js";

vi.mock("../../src/services/noteService.js", () => ({
    getPendingNotesService: vi.fn(),
    getRejectedNotesService: vi.fn(),
    updateNoteStatusService: vi.fn(),
}));

vi.mock("../../src/middleware/authMiddleware.js", () => ({
    default: (req, res, next) => {
        req.user = {
            userId: "ADM001",
            email: "admin@studysnap.com",
            role: "ADMIN",
            jti: "mock-admin-jti",
        };

        next();
    },
}));

describe("Admin API", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // =========================================================
    // GET /admin/notes/pending
    // =========================================================

    describe("GET /admin/notes/pending", () => {

        it("should fetch pending notes successfully", async () => {
            const notes = [
                {
                    noteId: 101,
                    title: "Data Structures",
                    status: "pending",
                },
                {
                    noteId: 102,
                    title: "Operating Systems",
                    status: "pending",
                },
            ];

            getPendingNotesService.mockResolvedValue(notes);

            const response = await request(app)
                .get("/admin/notes/pending")
                .set(
                    "Authorization",
                    "Bearer mock-admin-token"
                );

            expect(response.status).toBe(200);

            expect(response.body).toEqual({
                success: true,
                count: 2,
                data: notes,
            });
        });

        it("should return the correct pending-note count", async () => {
            const notes = [
                { noteId: 101, status: "pending" },
                { noteId: 102, status: "pending" },
                { noteId: 103, status: "pending" },
            ];

            getPendingNotesService.mockResolvedValue(notes);

            const response = await request(app)
                .get("/admin/notes/pending")
                .set(
                    "Authorization",
                    "Bearer mock-admin-token"
                );

            expect(response.status).toBe(200);
            expect(response.body.count).toBe(3);
        });

        it("should return 500 when fetching pending notes fails", async () => {
            getPendingNotesService.mockRejectedValue(
                new Error("Database failure")
            );

            const response = await request(app)
                .get("/admin/notes/pending")
                .set(
                    "Authorization",
                    "Bearer mock-admin-token"
                );

            expect(response.status).toBe(500);

            expect(response.body).toEqual({
                success: false,
                message: "Database failure",
            });
        });
    });

    // =========================================================
    // GET /admin/notes/rejected
    // =========================================================

    describe("GET /admin/notes/rejected", () => {

        it("should fetch rejected notes successfully", async () => {
            const notes = [
                {
                    noteId: 201,
                    title: "Computer Networks",
                    status: "rejected",
                    rejectionReason: "Poor quality PDF",
                },
                {
                    noteId: 202,
                    title: "DBMS",
                    status: "rejected",
                    rejectionReason: "Incomplete notes",
                },
            ];

            getRejectedNotesService.mockResolvedValue(notes);

            const response = await request(app)
                .get("/admin/notes/rejected")
                .set(
                    "Authorization",
                    "Bearer mock-admin-token"
                );

            expect(response.status).toBe(200);

            expect(response.body).toEqual({
                success: true,
                count: 2,
                data: notes,
            });
        });

        it("should return the correct rejected-note count", async () => {
            const notes = [
                { noteId: 201, status: "rejected" },
                { noteId: 202, status: "rejected" },
                { noteId: 203, status: "rejected" },
            ];

            getRejectedNotesService.mockResolvedValue(notes);

            const response = await request(app)
                .get("/admin/notes/rejected")
                .set(
                    "Authorization",
                    "Bearer mock-admin-token"
                );

            expect(response.status).toBe(200);
            expect(response.body.count).toBe(3);
        });

        it("should return 500 when fetching rejected notes fails", async () => {
            getRejectedNotesService.mockRejectedValue(
                new Error("Database failure")
            );

            const response = await request(app)
                .get("/admin/notes/rejected")
                .set(
                    "Authorization",
                    "Bearer mock-admin-token"
                );

            expect(response.status).toBe(500);

            expect(response.body).toEqual({
                success: false,
                message: "Database failure",
            });
        });
    });

    // =========================================================
    // PATCH /admin/notes/:id/status
    // =========================================================

    describe("PATCH /admin/notes/:id/status", () => {

        it("should approve a pending note successfully", async () => {
            const note = {
                noteId: 101,
                title: "Data Structures",
                status: "approved",
                approvedBy: "admin@studysnap.com",
            };

            updateNoteStatusService.mockResolvedValue(note);

            const response = await request(app)
                .patch("/admin/notes/101/status")
                .set(
                    "Authorization",
                    "Bearer mock-admin-token"
                )
                .send({
                    status: "approved",
                });

            expect(response.status).toBe(200);

            expect(response.body).toEqual({
                success: true,
                message: "Note approved successfully",
                note,
            });
        });

        it("should reject a pending note successfully", async () => {
            const note = {
                noteId: 102,
                title: "Operating Systems",
                status: "rejected",
                rejectionReason: "Incomplete notes",
            };

            updateNoteStatusService.mockResolvedValue(note);

            const response = await request(app)
                .patch("/admin/notes/102/status")
                .set(
                    "Authorization",
                    "Bearer mock-admin-token"
                )
                .send({
                    status: "rejected",
                    rejectionReason: "Incomplete notes",
                });

            expect(response.status).toBe(200);

            expect(response.body).toEqual({
                success: true,
                message: "Note rejected successfully",
                note,
            });
        });

        it("should pass note ID, status, rejection reason and admin email to the service", async () => {
            const note = {
                noteId: 103,
                title: "Database Systems",
                status: "rejected",
                rejectionReason: "Invalid content",
            };

            updateNoteStatusService.mockResolvedValue(note);

            const response = await request(app)
                .patch("/admin/notes/103/status")
                .set(
                    "Authorization",
                    "Bearer mock-admin-token"
                )
                .send({
                    status: "rejected",
                    rejectionReason: "Invalid content",
                });

            expect(response.status).toBe(200);

            expect(updateNoteStatusService).toHaveBeenCalledTimes(1);

            expect(updateNoteStatusService).toHaveBeenCalledWith(
                "103",
                "rejected",
                "Invalid content",
                "admin@studysnap.com"
            );
        });

        it("should pass undefined rejection reason when approving a note", async () => {
            const note = {
                noteId: 104,
                title: "Machine Learning",
                status: "approved",
            };

            updateNoteStatusService.mockResolvedValue(note);

            const response = await request(app)
                .patch("/admin/notes/104/status")
                .set(
                    "Authorization",
                    "Bearer mock-admin-token"
                )
                .send({
                    status: "approved",
                });

            expect(response.status).toBe(200);

            expect(updateNoteStatusService).toHaveBeenCalledWith(
                "104",
                "approved",
                undefined,
                "admin@studysnap.com"
            );
        });

        it("should return the service error when note status update fails", async () => {
            const error = new Error(
                "Pending note not found or note has already been reviewed"
            );
            error.statusCode = 404;

            updateNoteStatusService.mockRejectedValue(error);

            const response = await request(app)
                .patch("/admin/notes/999/status")
                .set(
                    "Authorization",
                    "Bearer mock-admin-token"
                )
                .send({
                    status: "approved",
                });

            expect(response.status).toBe(404);

            expect(response.body).toEqual({
                success: false,
                message:
                    "Pending note not found or note has already been reviewed",
            });
        });

        it("should return 400 for an invalid note status", async () => {
            const error = new Error(
                "Status can only be approved or rejected"
            );
            error.statusCode = 400;

            updateNoteStatusService.mockRejectedValue(error);

            const response = await request(app)
                .patch("/admin/notes/105/status")
                .set(
                    "Authorization",
                    "Bearer mock-admin-token"
                )
                .send({
                    status: "pending",
                });

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                success: false,
                message: "Status can only be approved or rejected",
            });
        });
    });
});