import { describe, it, expect, beforeEach, vi } from "vitest";

import {
    validateCreateSubject,
    validateUpdateSubject
} from "../../src/middleware/validation/subjectValidation.js";

describe("validateCreateSubject", () => {

    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            body: {
                subjectName: "  Data Structures  ",
                deptId: ["1", "2"]
            }
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        };

        next = vi.fn();
    });

    // =========================================================
    // VALID CREATE DATA
    // =========================================================

    it("should accept valid subject data", () => {
        validateCreateSubject(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("should trim subject name", () => {
        validateCreateSubject(req, res, next);

        expect(req.body.subjectName).toBe("Data Structures");
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("should convert department IDs to numbers", () => {
        validateCreateSubject(req, res, next);

        expect(req.body.deptId).toEqual([1, 2]);
        expect(req.body.deptId.every(id => typeof id === "number")).toBe(true);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("should accept a single department ID", () => {
        req.body.deptId = ["5"];

        validateCreateSubject(req, res, next);

        expect(req.body.deptId).toEqual([5]);
        expect(next).toHaveBeenCalledTimes(1);
    });

    // =========================================================
    // CREATE SUBJECT NAME VALIDATION
    // =========================================================

    it("should reject a missing subject name", () => {
        delete req.body.subjectName;

        validateCreateSubject(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Subject name is required"
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should reject a null subject name", () => {
        req.body.subjectName = null;

        validateCreateSubject(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Subject name is required"
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should reject a non-string subject name", () => {
        req.body.subjectName = 123;

        validateCreateSubject(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Subject name must be a string"
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should reject an invalid subject name format", () => {
        req.body.subjectName = "Data@Structures";

        validateCreateSubject(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Invalid subject name format"
        });
        expect(next).not.toHaveBeenCalled();
    });

    // =========================================================
    // CREATE DEPARTMENT ID VALIDATION
    // =========================================================

    it("should reject missing department IDs", () => {
        delete req.body.deptId;

        validateCreateSubject(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Department ID(s) are required"
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should reject an empty department ID array", () => {
        req.body.deptId = [];

        validateCreateSubject(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Department ID(s) are required"
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should reject a non-array department ID", () => {
        req.body.deptId = "1";

        validateCreateSubject(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Department ID(s) are required"
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should reject a zero department ID", () => {
        req.body.deptId = ["0"];

        validateCreateSubject(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Department IDs must be positive integers"
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should reject a negative department ID", () => {
        req.body.deptId = ["-2"];

        validateCreateSubject(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Department IDs must be positive integers"
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should reject a decimal department ID", () => {
        req.body.deptId = ["1.5"];

        validateCreateSubject(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Department IDs must be positive integers"
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should reject a non-numeric department ID", () => {
        req.body.deptId = ["abc"];

        validateCreateSubject(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Department IDs must be positive integers"
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should reject when any department ID in the array is invalid", () => {
        req.body.deptId = ["1", "abc", "3"];

        validateCreateSubject(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Department IDs must be positive integers"
        });
        expect(next).not.toHaveBeenCalled();
    });
});


describe("validateUpdateSubject", () => {

    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            body: {
                subjectName: "  Operating Systems  ",
                deptId: ["3", "4"]
            }
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        };

        next = vi.fn();
    });

    // =========================================================
    // VALID UPDATE DATA
    // =========================================================

    it("should accept both subject name and department IDs", () => {
        validateUpdateSubject(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(req.body.subjectName).toBe("Operating Systems");
        expect(req.body.deptId).toEqual([3, 4]);
    });

    it("should accept an update with only subject name", () => {
        delete req.body.deptId;

        validateUpdateSubject(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(req.body.subjectName).toBe("Operating Systems");
    });

    it("should accept an update with only department IDs", () => {
        delete req.body.subjectName;

        validateUpdateSubject(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(req.body.deptId).toEqual([3, 4]);
    });

    // =========================================================
    // UPDATE REQUIRED FIELD
    // =========================================================

    it("should reject an empty update body", () => {
        req.body = {};

        validateUpdateSubject(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "At least one field is required for update"
        });
        expect(next).not.toHaveBeenCalled();
    });

    // =========================================================
    // UPDATE SUBJECT NAME
    // =========================================================

    it("should reject a non-string subject name", () => {
        req.body = {
            subjectName: 123
        };

        validateUpdateSubject(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Subject name must be a string"
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should reject an invalid subject name format", () => {
        req.body = {
            subjectName: "Operating@Systems"
        };

        validateUpdateSubject(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Invalid subject name format"
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should trim the subject name during update", () => {
        req.body = {
            subjectName: "   Computer Networks   "
        };

        validateUpdateSubject(req, res, next);

        expect(req.body.subjectName).toBe("Computer Networks");
        expect(next).toHaveBeenCalledTimes(1);
    });

    // =========================================================
    // UPDATE DEPARTMENT IDs
    // =========================================================

    it("should reject an empty department ID array", () => {
        req.body = {
            deptId: []
        };

        validateUpdateSubject(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Department ID(s) must be a non-empty array"
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should reject a non-array department ID", () => {
        req.body = {
            deptId: "1"
        };

        validateUpdateSubject(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Department ID(s) must be a non-empty array"
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should reject an invalid department ID during update", () => {
        req.body = {
            deptId: ["1", "abc"]
        };

        validateUpdateSubject(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Department IDs must be positive integers"
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should reject a non-positive department ID during update", () => {
        req.body = {
            deptId: ["0"]
        };

        validateUpdateSubject(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Department IDs must be positive integers"
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should normalize department IDs during update", () => {
        req.body = {
            deptId: ["10", "20", "30"]
        };

        validateUpdateSubject(req, res, next);

        expect(req.body.deptId).toEqual([10, 20, 30]);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("should call next exactly once for a valid update", () => {
        req.body = {
            subjectName: "Database Systems",
            deptId: ["5"]
        };

        validateUpdateSubject(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
    });
});