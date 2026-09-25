import { describe, it, expect, beforeEach, vi } from "vitest";

import {
    validateNoteTag
} from "../../src/middleware/validation/noteTagValidation.js";

describe("validateNoteTag", () => {

    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            params: {
                noteId: "101"
            },
            body: {
                tag: "red"
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

    it("should accept valid note ID and tag", () => {
        validateNoteTag(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("should convert note ID to a number", () => {
        validateNoteTag(req, res, next);

        expect(req.params.noteId).toBe(101);
        expect(typeof req.params.noteId).toBe("number");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("should normalize tag to lowercase", () => {
        req.body.tag = "RED";

        validateNoteTag(req, res, next);

        expect(req.body.tag).toBe("red");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("should trim whitespace from tag", () => {
        req.body.tag = "  blue  ";

        validateNoteTag(req, res, next);

        expect(req.body.tag).toBe("blue");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("should accept all supported tags", () => {
        for (const tag of ["red", "blue", "yellow"]) {
            req.params.noteId = "101";
            req.body.tag = tag;
            next.mockClear();
            res.status.mockClear();
            res.json.mockClear();

            validateNoteTag(req, res, next);

            expect(next).toHaveBeenCalledTimes(1);
            expect(req.body.tag).toBe(tag);
        }
    });

    // =========================================================
    // NOTE ID VALIDATION
    // =========================================================

    it("should reject a missing note ID", () => {
        delete req.params.noteId;

        validateNoteTag(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Note ID is required"
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should reject an empty note ID", () => {
        req.params.noteId = "";

        validateNoteTag(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Note ID is required"
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should reject a zero note ID", () => {
        req.params.noteId = "0";

        validateNoteTag(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Note ID must be a positive integer"
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should reject a negative note ID", () => {
        req.params.noteId = "-5";

        validateNoteTag(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Note ID must be a positive integer"
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should reject a decimal note ID", () => {
        req.params.noteId = "10.5";

        validateNoteTag(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Note ID must be a positive integer"
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should reject a non-numeric note ID", () => {
        req.params.noteId = "abc";

        validateNoteTag(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Note ID must be a positive integer"
        });

        expect(next).not.toHaveBeenCalled();
    });

    // =========================================================
    // TAG VALIDATION
    // =========================================================

    it("should reject a missing tag", () => {
        delete req.body.tag;

        validateNoteTag(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Tag is required"
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should reject a non-string tag", () => {
        req.body.tag = 123;

        validateNoteTag(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Tag is required"
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should reject an empty tag", () => {
        req.body.tag = "";

        validateNoteTag(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Tag is required"
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should reject an unsupported tag", () => {
        req.body.tag = "green";

        validateNoteTag(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Tag can only be red, blue or yellow"
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should reject whitespace-only tag", () => {
        req.body.tag = "   ";

        validateNoteTag(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Tag can only be red, blue or yellow"
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should accept uppercase and mixed-case tags", () => {
        const cases = [
            ["RED", "red"],
            ["BLUE", "blue"],
            ["YeLLoW", "yellow"]
        ];

        for (const [input, expected] of cases) {
            req.params.noteId = "101";
            req.body.tag = input;
            next.mockClear();
            res.status.mockClear();
            res.json.mockClear();

            validateNoteTag(req, res, next);

            expect(req.body.tag).toBe(expected);
            expect(next).toHaveBeenCalledTimes(1);
        }
    });

    it("should call next exactly once for valid data", () => {
        validateNoteTag(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
    });
});