import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

vi.mock("../../src/services/noteService.js", () => ({
    searchNotesService: vi.fn()
}));

import app from "../../src/app.js";

import {
    searchNotesService
} from "../../src/services/noteService.js";

describe("Notes Search, Filter & Pagination API", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockResult = {
        notes: [
            {
                noteId: 101,
                title: "Data Structures Notes",
                description: "Complete DSA notes",
                semester: 5,
                deptId: 1,
                subjectId: 10,
                status: "approved"
            }
        ],
        pagination: {
            page: 1,
            limit: 10,
            total: 1,
            totalPages: 1
        }
    };

    // =========================================================
    // BASIC SEARCH
    // =========================================================

    describe("GET /notes/", () => {

        it("should return approved notes successfully", async () => {
            searchNotesService.mockResolvedValue(mockResult);

            const response = await request(app)
                .get("/notes/");

            expect(response.status).toBe(200);

            expect(response.body).toEqual({
                success: true,
                data: mockResult.notes,
                pagination: mockResult.pagination
            });

            expect(searchNotesService).toHaveBeenCalledTimes(1);
        });

        it("should return notes and pagination separately", async () => {
            searchNotesService.mockResolvedValue(mockResult);

            const response = await request(app)
                .get("/notes/");

            expect(response.body).toHaveProperty("success", true);
            expect(response.body).toHaveProperty("data");
            expect(response.body).toHaveProperty("pagination");

            expect(Array.isArray(response.body.data)).toBe(true);

            expect(response.body.pagination).toEqual({
                page: 1,
                limit: 10,
                total: 1,
                totalPages: 1
            });
        });

        // =====================================================
        // FILTERS
        // =====================================================

        it("should pass semester filter to the service", async () => {
            searchNotesService.mockResolvedValue(mockResult);

            const response = await request(app)
                .get("/notes/")
                .query({
                    semester: 5
                });

            expect(response.status).toBe(200);

            expect(searchNotesService).toHaveBeenCalledWith({
                semester: "5",
                deptId: undefined,
                subjectId: undefined,
                tag: undefined,
                search: undefined,
                page: undefined,
                limit: undefined
            });
        });

        it("should pass department filter to the service", async () => {
            searchNotesService.mockResolvedValue(mockResult);

            const response = await request(app)
                .get("/notes/")
                .query({
                    deptId: 2
                });

            expect(response.status).toBe(200);

            expect(searchNotesService).toHaveBeenCalledWith({
                semester: undefined,
                deptId: "2",
                subjectId: undefined,
                tag: undefined,
                search: undefined,
                page: undefined,
                limit: undefined
            });
        });

        it("should pass subject filter to the service", async () => {
            searchNotesService.mockResolvedValue(mockResult);

            const response = await request(app)
                .get("/notes/")
                .query({
                    subjectId: 10
                });

            expect(response.status).toBe(200);

            expect(searchNotesService).toHaveBeenCalledWith({
                semester: undefined,
                deptId: undefined,
                subjectId: "10",
                tag: undefined,
                search: undefined,
                page: undefined,
                limit: undefined
            });
        });

        it("should pass text search to the service", async () => {
            searchNotesService.mockResolvedValue(mockResult);

            const response = await request(app)
                .get("/notes/")
                .query({
                    search: "data structures"
                });

            expect(response.status).toBe(200);

            expect(searchNotesService).toHaveBeenCalledWith({
                semester: undefined,
                deptId: undefined,
                subjectId: undefined,
                tag: undefined,
                search: "data structures",
                page: undefined,
                limit: undefined
            });
        });

        it("should pass pagination parameters to the service", async () => {
            searchNotesService.mockResolvedValue({
                ...mockResult,
                pagination: {
                    page: 2,
                    limit: 5,
                    total: 11,
                    totalPages: 3
                }
            });

            const response = await request(app)
                .get("/notes/")
                .query({
                    page: 2,
                    limit: 5
                });

            expect(response.status).toBe(200);

            expect(searchNotesService).toHaveBeenCalledWith({
                semester: undefined,
                deptId: undefined,
                subjectId: undefined,
                tag: undefined,
                search: undefined,
                page: "2",
                limit: "5"
            });

            expect(response.body.pagination).toEqual({
                page: 2,
                limit: 5,
                total: 11,
                totalPages: 3
            });
        });

        it("should pass multiple filters together", async () => {
            searchNotesService.mockResolvedValue(mockResult);

            const response = await request(app)
                .get("/notes/")
                .query({
                    semester: 5,
                    deptId: 1,
                    subjectId: 10,
                    search: "data",
                    page: 2,
                    limit: 5
                });

            expect(response.status).toBe(200);

            expect(searchNotesService).toHaveBeenCalledWith({
                semester: "5",
                deptId: "1",
                subjectId: "10",
                tag: undefined,
                search: "data",
                page: "2",
                limit: "5"
            });
        });

        // =====================================================
        // QUERY VALIDATION
        // =====================================================

        it("should reject an unknown query parameter", async () => {
            const response = await request(app)
                .get("/notes/")
                .query({
                    category: "DSA"
                });

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                success: false,
                message: "Invalid query parameter(s): category"
            });

            expect(searchNotesService).not.toHaveBeenCalled();
        });

        it("should handle invalid page from the service", async () => {
            const error = new Error(
                "Page must be a positive integer"
            );
            error.statusCode = 400;

            searchNotesService.mockRejectedValue(error);

            const response = await request(app)
                .get("/notes/")
                .query({
                    page: 0
                });

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                success: false,
                message: "Page must be a positive integer"
            });
        });

        it("should handle invalid limit from the service", async () => {
            const error = new Error(
                "Limit must be an integer between 1 and 100"
            );
            error.statusCode = 400;

            searchNotesService.mockRejectedValue(error);

            const response = await request(app)
                .get("/notes/")
                .query({
                    limit: 101
                });

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                success: false,
                message: "Limit must be an integer between 1 and 100"
            });
        });

        it("should handle invalid semester from the service", async () => {
            const error = new Error(
                "Semester must be an integer between 1 and 8"
            );
            error.statusCode = 400;

            searchNotesService.mockRejectedValue(error);

            const response = await request(app)
                .get("/notes/")
                .query({
                    semester: 9
                });

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                success: false,
                message: "Semester must be an integer between 1 and 8"
            });
        });

        it("should handle invalid department ID from the service", async () => {
            const error = new Error(
                "Department ID must be a valid integer"
            );
            error.statusCode = 400;

            searchNotesService.mockRejectedValue(error);

            const response = await request(app)
                .get("/notes/")
                .query({
                    deptId: "abc"
                });

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                success: false,
                message: "Department ID must be a valid integer"
            });
        });

        it("should handle invalid subject ID from the service", async () => {
            const error = new Error(
                "Subject ID must be a valid integer"
            );
            error.statusCode = 400;

            searchNotesService.mockRejectedValue(error);

            const response = await request(app)
                .get("/notes/")
                .query({
                    subjectId: "abc"
                });

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                success: false,
                message: "Subject ID must be a valid integer"
            });
        });

        // =====================================================
        // SERVICE FAILURE
        // =====================================================

        it("should handle unexpected service errors", async () => {
            searchNotesService.mockRejectedValue(
                new Error("Database failure")
            );

            const response = await request(app)
                .get("/notes/")
                .query({
                    search: "database"
                });

            expect(response.status).toBe(500);

            expect(response.body).toEqual({
                success: false,
                message: "Database failure"
            });
        });
    });
});