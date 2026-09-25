import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

vi.mock("../../src/services/noteService.js", () => ({
    createNoteService: vi.fn(),
    getApprovedNotesByIdService: vi.fn()
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
    createNoteService,
    getApprovedNotesByIdService
} from "../../src/services/noteService.js";

describe("Notes API", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // =========================================================
    // GET /notes/:noteId
    // =========================================================

    describe("GET /notes/:noteId", () => {

        it("should get an approved note successfully", async () => {
            const note = {
                noteId: 101,
                title: "Data Structures Notes",
                description: "Complete notes",
                semester: 5,
                deptId: 1,
                subjectId: 10,
                status: "approved"
            };

            getApprovedNotesByIdService.mockResolvedValue(note);

            const response = await request(app)
                .get("/notes/101");

            expect(response.status).toBe(200);

            expect(response.body).toEqual({
                success: true,
                data: note
            });

            expect(getApprovedNotesByIdService)
                .toHaveBeenCalledTimes(1);

            expect(getApprovedNotesByIdService)
                .toHaveBeenCalledWith("101");
        });

        it("should return the correct response structure", async () => {
            const note = {
                noteId: 102,
                title: "Operating Systems",
                status: "approved"
            };

            getApprovedNotesByIdService.mockResolvedValue(note);

            const response = await request(app)
                .get("/notes/102");

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("success", true);
            expect(response.body).toHaveProperty("data");
            expect(response.body.data).toEqual(note);
        });

        it("should reject an invalid note ID", async () => {
            const error = new Error("Valid noteId is required");
            error.statusCode = 400;

            getApprovedNotesByIdService.mockRejectedValue(error);

            const response = await request(app)
                .get("/notes/abc");

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                success: false,
                message: "Valid noteId is required"
            });
        });

        it("should return 404 when approved note is not found", async () => {
            const error = new Error("Approved note not found");
            error.statusCode = 404;

            getApprovedNotesByIdService.mockRejectedValue(error);

            const response = await request(app)
                .get("/notes/999");

            expect(response.status).toBe(404);

            expect(response.body).toEqual({
                success: false,
                message: "Approved note not found"
            });
        });

        it("should handle unexpected service errors", async () => {
            getApprovedNotesByIdService.mockRejectedValue(
                new Error("Database failure")
            );

            const response = await request(app)
                .get("/notes/101");

            expect(response.status).toBe(500);

            expect(response.body).toEqual({
                success: false,
                message: "Database failure"
            });
        });
    });

    // =========================================================
    // POST /notes/
    // =========================================================

    describe("POST /notes/", () => {

        const validFields = {
            title: "Data Structures Notes",
            description: "Complete notes for semester 5",
            semester: "5",
            deptId: "1",
            subjectId: "10",
            uploadedBy: "student@example.com"
        };

        it("should create a note successfully", async () => {
            const note = {
                noteId: 101,
                title: "Data Structures Notes",
                description: "Complete notes for semester 5",
                semester: 5,
                deptId: 1,
                subjectId: 10,
                uploadedBy: "student@example.com",
                status: "pending"
            };

            createNoteService.mockResolvedValue(note);

            const response = await request(app)
                .post("/notes/")
                .field("title", validFields.title)
                .field("description", validFields.description)
                .field("semester", validFields.semester)
                .field("deptId", validFields.deptId)
                .field("subjectId", validFields.subjectId)
                .field("uploadedBy", validFields.uploadedBy)
                .attach(
                    "pdf",
                    Buffer.from("%PDF-test"),
                    {
                        filename: "notes.pdf",
                        contentType: "application/pdf"
                    }
                );

            expect(response.status).toBe(201);

            expect(response.body).toEqual({
                success: true,
                message: "Note uploaded successfully",
                data: note
            });

            expect(createNoteService).toHaveBeenCalledTimes(1);
        });

        it("should forward normalized fields to the service", async () => {
            const note = {
                noteId: 102,
                title: "Operating Systems",
                semester: 5,
                deptId: 1,
                subjectId: 10,
                status: "pending"
            };

            createNoteService.mockResolvedValue(note);

            const response = await request(app)
                .post("/notes/")
                .field("title", "   Operating Systems   ")
                .field("description", "OS notes")
                .field("semester", "5")
                .field("deptId", "1")
                .field("subjectId", "10")
                .field("uploadedBy", "faculty@example.com")
                .attach(
                    "pdf",
                    Buffer.from("%PDF-test"),
                    {
                        filename: "os.pdf",
                        contentType: "application/pdf"
                    }
                );

            expect(response.status).toBe(201);

            const serviceCall = createNoteService.mock.calls[0][0];

            expect(serviceCall.title).toBe("Operating Systems");
            expect(serviceCall.semester).toBe(5);
            expect(serviceCall.deptId).toBe(1);
            expect(serviceCall.subjectId).toBe(10);
            expect(serviceCall.uploadedBy)
                .toBe("faculty@example.com");

            expect(serviceCall.file).toBeDefined();
            expect(serviceCall.file.originalname).toBe("os.pdf");
        });

        it("should reject a missing title", async () => {
            const response = await request(app)
                .post("/notes/")
                .field("description", "Some notes")
                .field("semester", "5")
                .field("deptId", "1")
                .field("subjectId", "10")
                .field("uploadedBy", "student@example.com")
                .attach(
                    "pdf",
                    Buffer.from("%PDF-test"),
                    {
                        filename: "notes.pdf",
                        contentType: "application/pdf"
                    }
                );

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                success: false,
                message: "Title is required"
            });

            expect(createNoteService).not.toHaveBeenCalled();
        });

        it("should reject an invalid title", async () => {
            const response = await request(app)
                .post("/notes/")
                .field("title", "Data@Structures")
                .field("semester", "5")
                .field("deptId", "1")
                .field("subjectId", "10")
                .field("uploadedBy", "student@example.com")
                .attach(
                    "pdf",
                    Buffer.from("%PDF-test"),
                    {
                        filename: "notes.pdf",
                        contentType: "application/pdf"
                    }
                );

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                success: false,
                message: "Invalid title format"
            });

            expect(createNoteService).not.toHaveBeenCalled();
        });

        it("should reject an invalid semester", async () => {
            const response = await request(app)
                .post("/notes/")
                .field("title", "Data Structures")
                .field("semester", "9")
                .field("deptId", "1")
                .field("subjectId", "10")
                .field("uploadedBy", "student@example.com")
                .attach(
                    "pdf",
                    Buffer.from("%PDF-test"),
                    {
                        filename: "notes.pdf",
                        contentType: "application/pdf"
                    }
                );

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                success: false,
                message: "Semester must be between 1 and 8"
            });

            expect(createNoteService).not.toHaveBeenCalled();
        });

        it("should reject a missing PDF", async () => {
            const response = await request(app)
                .post("/notes/")
                .field("title", "Data Structures")
                .field("semester", "5")
                .field("deptId", "1")
                .field("subjectId", "10")
                .field("uploadedBy", "student@example.com");

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                success: false,
                message: "PDF file is required"
            });

            expect(createNoteService).not.toHaveBeenCalled();
        });

        it("should handle note service errors", async () => {
            const error = new Error("Department not found");
            error.statusCode = 404;

            createNoteService.mockRejectedValue(error);

            const response = await request(app)
                .post("/notes/")
                .field("title", validFields.title)
                .field("description", validFields.description)
                .field("semester", validFields.semester)
                .field("deptId", validFields.deptId)
                .field("subjectId", validFields.subjectId)
                .field("uploadedBy", validFields.uploadedBy)
                .attach(
                    "pdf",
                    Buffer.from("%PDF-test"),
                    {
                        filename: "notes.pdf",
                        contentType: "application/pdf"
                    }
                );

            expect(response.status).toBe(404);

            expect(response.body).toEqual({
                success: false,
                message: "Department not found"
            });
        });

        it("should reject a non-PDF file", async () => {
            const response = await request(app)
                .post("/notes/")
                .field("title", validFields.title)
                .field("description", validFields.description)
                .field("semester", validFields.semester)
                .field("deptId", validFields.deptId)
                .field("subjectId", validFields.subjectId)
                .field("uploadedBy", validFields.uploadedBy)
                .attach(
                    "pdf",
                    Buffer.from("not a pdf"),
                    {
                        filename: "notes.txt",
                        contentType: "text/plain"
                    }
                );

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                success: false,
                message: "Only PDF files are allowed"
            });

            expect(createNoteService).not.toHaveBeenCalled();
        });
    });
});