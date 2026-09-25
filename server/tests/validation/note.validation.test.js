import { describe, it, expect, beforeEach, vi } from "vitest";

import {
    validateNote
} from "../../src/middleware/validation/noteValidation.js";

describe("validateNote", () => {

    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            body: {
                title: "Data Structures Notes",
                semester: "5",
                deptId: "1",
                subjectId: "10"
            },
            file: {
                fieldname: "pdf",
                originalname: "notes.pdf",
                mimetype: "application/pdf"
            }
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        };

        next = vi.fn();
    });

    // =========================================================
    // VALID DATA
    // =========================================================

    it("should accept valid note data", () => {
        validateNote(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("should trim the title", () => {
        req.body.title = "   Data Structures Notes   ";

        validateNote(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(req.body.title).toBe("Data Structures Notes");
    });

    it("should convert semester to a number", () => {
        req.body.semester = "5";

        validateNote(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(req.body.semester).toBe(5);
        expect(typeof req.body.semester).toBe("number");
    });

    it("should convert department ID to a number", () => {
        req.body.deptId = "12";

        validateNote(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(req.body.deptId).toBe(12);
        expect(typeof req.body.deptId).toBe("number");
    });

    it("should convert subject ID to a number", () => {
        req.body.subjectId = "25";

        validateNote(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(req.body.subjectId).toBe(25);
        expect(typeof req.body.subjectId).toBe("number");
    });

    // =========================================================
    // TITLE VALIDATION
    // =========================================================

    it("should reject a missing title", () => {
        delete req.body.title;

        validateNote(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Title is required"
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should reject a non-string title", () => {
        req.body.title = 12345;

        validateNote(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Title is required"
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should reject an invalid title format", () => {
        req.body.title = "Data@Structures";

        validateNote(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Invalid title format"
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should reject a title shorter than 2 characters", () => {
        req.body.title = "A";

        validateNote(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Title must be between 2 and 150 characters"
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should reject a title longer than 150 characters", () => {
        req.body.title = "A".repeat(151);

        validateNote(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Title must be between 2 and 150 characters"
        });

        expect(next).not.toHaveBeenCalled();
    });

    // =========================================================
    // SEMESTER VALIDATION
    // =========================================================

    it("should reject a missing semester", () => {
        delete req.body.semester;

        validateNote(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Semester is required"
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should reject a non-positive or non-integer semester", () => {
        req.body.semester = "0";

        validateNote(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Semester must be a positive integer"
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should reject a semester outside 1 to 8", () => {
        req.body.semester = "9";

        validateNote(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Semester must be between 1 and 8"
        });

        expect(next).not.toHaveBeenCalled();
    });

    // =========================================================
    // DEPARTMENT ID VALIDATION
    // =========================================================

    it("should reject a missing department ID", () => {
        delete req.body.deptId;

        validateNote(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Department ID is required"
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should reject an invalid department ID", () => {
        req.body.deptId = "abc";

        validateNote(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Department ID must be a positive integer"
        });

        expect(next).not.toHaveBeenCalled();
    });

    // =========================================================
    // SUBJECT ID VALIDATION
    // =========================================================

    it("should reject a missing subject ID", () => {
        delete req.body.subjectId;

        validateNote(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Subject ID is required"
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should reject an invalid subject ID", () => {
        req.body.subjectId = "abc";

        validateNote(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Subject ID must be a positive integer"
        });

        expect(next).not.toHaveBeenCalled();
    });

    // =========================================================
    // FILE VALIDATION
    // =========================================================

    it("should reject a missing PDF file", () => {
        delete req.file;

        validateNote(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "PDF file is required"
        });

        expect(next).not.toHaveBeenCalled();
    });

    // =========================================================
    // NEXT
    // =========================================================

    it("should call next exactly once for valid data", () => {
        validateNote(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
    });
});