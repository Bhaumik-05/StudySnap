import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

vi.mock("../../src/services/noteService.js", () => ({
    assignNoteTagService: vi.fn()
}));

vi.mock("../../src/services/noteTagService.js", () => ({
    getUserTaggedNotesService: vi.fn()
}));

vi.mock("../../src/middleware/authMiddleware.js", () => ({
    default: (req, res, next) => {
        req.user = {
            userId: "USR001",
            role: "STUDENT"
        };

        next();
    }
}));

vi.mock("../../src/middleware/roleMiddleware.js", () => ({
    default: (...allowedRoles) => {
        return (req, res, next) => {
            if (!req.user) {
                return res.status(401).json({
                    message: "Authentication required"
                });
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    message: "You are not authorized to perform this action"
                });
            }

            next();
        };
    }
}));

import app from "../../src/app.js";

import {
    assignNoteTagService
} from "../../src/services/noteService.js";

import {
    getUserTaggedNotesService
} from "../../src/services/noteTagService.js";

describe("Note Tags API", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // =========================================================
    // PATCH /notes/:noteId/tag
    // =========================================================

    describe("PATCH /notes/:noteId/tag", () => {

        it("should assign a tag successfully", async () => {
            const result = {
                noteId: 101,
                userId: "USR001",
                tag: "red"
            };

            assignNoteTagService.mockResolvedValue(result);

            const response = await request(app)
                .patch("/notes/101/tag")
                .send({
                    tag: "red"
                });

            expect(response.status).toBe(200);

            expect(response.body).toEqual({
                success: true,
                message: "Tag assigned successfully",
                data: result
            });

            expect(assignNoteTagService).toHaveBeenCalledTimes(1);
        });

        it("should pass note ID, authenticated user ID and tag to the service", async () => {
            const result = {
                noteId: 101,
                userId: "USR001",
                tag: "blue"
            };

            assignNoteTagService.mockResolvedValue(result);

            const response = await request(app)
                .patch("/notes/101/tag")
                .send({
                    tag: "blue"
                });

            expect(response.status).toBe(200);

            expect(assignNoteTagService).toHaveBeenCalledWith(
                101,
                "USR001",
                "blue"
            );
        });

        it("should normalize uppercase and whitespace in the tag", async () => {
            const result = {
                noteId: 101,
                userId: "USR001",
                tag: "yellow"
            };

            assignNoteTagService.mockResolvedValue(result);

            const response = await request(app)
                .patch("/notes/101/tag")
                .send({
                    tag: "  YELLOW  "
                });

            expect(response.status).toBe(200);

            expect(assignNoteTagService).toHaveBeenCalledWith(
                101,
                "USR001",
                "yellow"
            );
        });

        it("should reject a missing tag", async () => {
            const response = await request(app)
                .patch("/notes/101/tag")
                .send({});

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                success: false,
                message: "Tag is required"
            });

            expect(assignNoteTagService).not.toHaveBeenCalled();
        });

        it("should reject an invalid tag", async () => {
            const response = await request(app)
                .patch("/notes/101/tag")
                .send({
                    tag: "green"
                });

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                success: false,
                message: "Tag can only be red, blue or yellow"
            });

            expect(assignNoteTagService).not.toHaveBeenCalled();
        });

        it("should reject an invalid note ID", async () => {
            const response = await request(app)
                .patch("/notes/abc/tag")
                .send({
                    tag: "red"
                });

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                success: false,
                message: "Note ID must be a positive integer"
            });

            expect(assignNoteTagService).not.toHaveBeenCalled();
        });

        it("should handle approved note not found", async () => {
            const error = new Error("Approved note not found");
            error.statusCode = 404;

            assignNoteTagService.mockRejectedValue(error);

            const response = await request(app)
                .patch("/notes/999/tag")
                .send({
                    tag: "red"
                });

            expect(response.status).toBe(404);

            expect(response.body).toEqual({
                success: false,
                message: "Approved note not found"
            });
        });

        it("should handle unexpected tag service errors", async () => {
            assignNoteTagService.mockRejectedValue(
                new Error("Database failure")
            );

            const response = await request(app)
                .patch("/notes/101/tag")
                .send({
                    tag: "blue"
                });

            expect(response.status).toBe(500);

            expect(response.body).toEqual({
                success: false,
                message: "Database failure"
            });
        });
    });

    // =========================================================
    // GET /notes/tagged
    // =========================================================

    describe("GET /notes/tagged", () => {

        it("should get the user's tagged notes successfully", async () => {
            const notes = [
                {
                    noteId: 101,
                    title: "Data Structures",
                    tag: "red",
                    semester: 5
                },
                {
                    noteId: 102,
                    title: "Operating Systems",
                    tag: "blue",
                    semester: 5
                }
            ];

            getUserTaggedNotesService.mockResolvedValue(notes);

            const response = await request(app)
                .get("/notes/tagged");

            expect(response.status).toBe(200);

            expect(response.body).toEqual({
                success: true,
                count: 2,
                data: notes
            });

            expect(getUserTaggedNotesService).toHaveBeenCalledTimes(1);
        });

        it("should return the correct count of tagged notes", async () => {
            const notes = [
                {
                    noteId: 101,
                    title: "Data Structures",
                    tag: "red"
                },
                {
                    noteId: 102,
                    title: "Operating Systems",
                    tag: "blue"
                },
                {
                    noteId: 103,
                    title: "DBMS",
                    tag: "yellow"
                }
            ];

            getUserTaggedNotesService.mockResolvedValue(notes);

            const response = await request(app)
                .get("/notes/tagged");

            expect(response.status).toBe(200);
            expect(response.body.count).toBe(3);
            expect(response.body.data).toHaveLength(3);
        });

        it("should pass the authenticated user ID to the service", async () => {
            getUserTaggedNotesService.mockResolvedValue([]);

            const response = await request(app)
                .get("/notes/tagged");

            expect(response.status).toBe(200);

            expect(getUserTaggedNotesService).toHaveBeenCalledWith(
                "USR001"
            );
        });

        it("should return an empty result when the user has no tagged notes", async () => {
            getUserTaggedNotesService.mockResolvedValue([]);

            const response = await request(app)
                .get("/notes/tagged");

            expect(response.status).toBe(200);

            expect(response.body).toEqual({
                success: true,
                count: 0,
                data: []
            });
        });

        it("should handle tagged notes service errors", async () => {
            getUserTaggedNotesService.mockRejectedValue(
                new Error("Database failure")
            );

            const response = await request(app)
                .get("/notes/tagged");

            expect(response.status).toBe(500);

            expect(response.body).toEqual({
                success: false,
                message: "Database failure"
            });
        });

        it("should preserve red, blue, yellow tag ordering", async () => {
            const notes = [
                {
                    noteId: 101,
                    title: "Red Note",
                    tag: "red"
                },
                {
                    noteId: 102,
                    title: "Another Red Note",
                    tag: "red"
                },
                {
                    noteId: 103,
                    title: "Blue Note",
                    tag: "blue"
                },
                {
                    noteId: 104,
                    title: "Yellow Note",
                    tag: "yellow"
                }
            ];

            getUserTaggedNotesService.mockResolvedValue(notes);

            const response = await request(app)
                .get("/notes/tagged");

            expect(response.status).toBe(200);

            expect(response.body.data.map(
                note => note.tag
            )).toEqual([
                "red",
                "red",
                "blue",
                "yellow"
            ]);
        });

        it("should return only notes that are available to the service", async () => {
            const notes = [
                {
                    noteId: 101,
                    title: "Available Note",
                    tag: "red"
                }
            ];

            getUserTaggedNotesService.mockResolvedValue(notes);

            const response = await request(app)
                .get("/notes/tagged");

            expect(response.status).toBe(200);

            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].noteId).toBe(101);
        });
    });
});