import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

vi.mock("../../src/services/SubjectService.js", () => ({
    getSubjectsService: vi.fn(),
    createSubjectService: vi.fn(),
    updateSubjectService: vi.fn(),
    deleteSubjectService: vi.fn()
}));

vi.mock("../../src/middleware/authMiddleware.js", () => ({
    default: (req, res, next) => {
        req.user = {
            userId: "ADM001",
            role: "ADMIN"
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
    getSubjectsService,
    createSubjectService,
    updateSubjectService,
    deleteSubjectService
} from "../../src/services/SubjectService.js";

describe("Subjects CRUD API", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // =========================================================
    // GET /subjects/
    // =========================================================

    describe("GET /subjects/", () => {

        it("should get all subjects successfully", async () => {
            const subjects = [
                {
                    subjectId: 1,
                    subjectName: "Data Structures",
                    deptId: [1, 2]
                },
                {
                    subjectId: 2,
                    subjectName: "Operating Systems",
                    deptId: [1]
                }
            ];

            getSubjectsService.mockResolvedValue(subjects);

            const response = await request(app)
                .get("/subjects/");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(subjects);
            expect(getSubjectsService).toHaveBeenCalledTimes(1);
        });

        it("should return subjects as an array", async () => {
            const subjects = [
                {
                    subjectId: 1,
                    subjectName: "Database Management",
                    deptId: [1]
                }
            ];

            getSubjectsService.mockResolvedValue(subjects);

            const response = await request(app)
                .get("/subjects/");

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        it("should return 500 when get subjects service fails", async () => {
            getSubjectsService.mockRejectedValue(
                new Error("Database failure")
            );

            const response = await request(app)
                .get("/subjects/");

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                message: "Database failure"
            });
        });
    });

    // =========================================================
    // POST /subjects/
    // =========================================================

    describe("POST /subjects/", () => {

        it("should create a subject successfully", async () => {
            const subject = {
                subjectId: 1,
                subjectName: "Data Structures",
                deptId: [1, 2]
            };

            createSubjectService.mockResolvedValue(subject);

            const response = await request(app)
                .post("/subjects/")
                .send({
                    subjectName: "Data Structures",
                    deptId: [1, 2]
                });

            expect(response.status).toBe(201);

            expect(response.body).toEqual({
                message: "Subject created successfully",
                subject
            });

            expect(createSubjectService).toHaveBeenCalledTimes(1);
            expect(createSubjectService).toHaveBeenCalledWith(
                "Data Structures",
                [1, 2]
            );
        });

        it("should trim subject name before passing it to the service", async () => {
            const subject = {
                subjectId: 2,
                subjectName: "Operating Systems",
                deptId: [1]
            };

            createSubjectService.mockResolvedValue(subject);

            const response = await request(app)
                .post("/subjects/")
                .send({
                    subjectName: "   Operating Systems   ",
                    deptId: ["1"]
                });

            expect(response.status).toBe(201);

            expect(createSubjectService).toHaveBeenCalledWith(
                "Operating Systems",
                [1]
            );
        });

        it("should reject an invalid subject name", async () => {
            const response = await request(app)
                .post("/subjects/")
                .send({
                    subjectName: "Data@Structures",
                    deptId: [1]
                });

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                success: false,
                message: "Invalid subject name format"
            });

            expect(createSubjectService).not.toHaveBeenCalled();
        });

        it("should reject missing department IDs", async () => {
            const response = await request(app)
                .post("/subjects/")
                .send({
                    subjectName: "Data Structures"
                });

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                success: false,
                message: "Department ID(s) are required"
            });

            expect(createSubjectService).not.toHaveBeenCalled();
        });

        it("should handle duplicate subject errors", async () => {
            const error = new Error(
                "Subject with this ID or name already exists"
            );
            error.statusCode = 409;

            createSubjectService.mockRejectedValue(error);

            const response = await request(app)
                .post("/subjects/")
                .send({
                    subjectName: "Data Structures",
                    deptId: [1]
                });

            expect(response.status).toBe(409);

            expect(response.body).toEqual({
                message: "Subject with this ID or name already exists"
            });
        });
    });

    // =========================================================
    // PATCH /subjects/:id
    // =========================================================

    describe("PATCH /subjects/:id", () => {

        it("should update a subject successfully", async () => {
            const subject = {
                subjectId: 1,
                subjectName: "Advanced Data Structures",
                deptId: [1, 2]
            };

            updateSubjectService.mockResolvedValue(subject);

            const response = await request(app)
                .patch("/subjects/1")
                .send({
                    subjectName: "Advanced Data Structures",
                    deptId: [1, 2]
                });

            expect(response.status).toBe(200);

            expect(response.body).toEqual({
                message: "Subject updated successfully",
                subject
            });

            expect(updateSubjectService).toHaveBeenCalledTimes(1);
            expect(updateSubjectService).toHaveBeenCalledWith(
                "1",
                "Advanced Data Structures",
                [1, 2]
            );
        });

        it("should reject an empty update body", async () => {
            const response = await request(app)
                .patch("/subjects/1")
                .send({});

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                success: false,
                message: "At least one field is required for update"
            });

            expect(updateSubjectService).not.toHaveBeenCalled();
        });

        it("should handle subject not found", async () => {
            const error = new Error("Subject not found");
            error.statusCode = 404;

            updateSubjectService.mockRejectedValue(error);

            const response = await request(app)
                .patch("/subjects/999")
                .send({
                    subjectName: "Operating Systems"
                });

            expect(response.status).toBe(404);

            expect(response.body).toEqual({
                message: "Subject not found"
            });
        });

        it("should handle duplicate subject name", async () => {
            const error = new Error(
                "Another subject with this name already exists"
            );
            error.statusCode = 409;

            updateSubjectService.mockRejectedValue(error);

            const response = await request(app)
                .patch("/subjects/1")
                .send({
                    subjectName: "Operating Systems"
                });

            expect(response.status).toBe(409);

            expect(response.body).toEqual({
                message: "Another subject with this name already exists"
            });
        });
    });

    // =========================================================
    // DELETE /subjects/:id
    // =========================================================

    describe("DELETE /subjects/:id", () => {

        it("should delete a subject successfully", async () => {
            const subject = {
                subjectId: 1,
                subjectName: "Data Structures",
                deptId: [1]
            };

            deleteSubjectService.mockResolvedValue(subject);

            const response = await request(app)
                .delete("/subjects/1");

            expect(response.status).toBe(200);

            expect(response.body).toEqual({
                message: "Subject deleted successfully",
                subject
            });

            expect(deleteSubjectService).toHaveBeenCalledTimes(1);
            expect(deleteSubjectService).toHaveBeenCalledWith("1");
        });

        it("should handle subject not found", async () => {
            const error = new Error("Subject not found");
            error.statusCode = 404;

            deleteSubjectService.mockRejectedValue(error);

            const response = await request(app)
                .delete("/subjects/999");

            expect(response.status).toBe(404);

            expect(response.body).toEqual({
                message: "Subject not found"
            });
        });

        it("should handle delete service errors", async () => {
            const error = new Error("Database failure");
            error.statusCode = 500;

            deleteSubjectService.mockRejectedValue(error);

            const response = await request(app)
                .delete("/subjects/1");

            expect(response.status).toBe(500);

            expect(response.body).toEqual({
                message: "Database failure"
            });
        });
    });
});