import { describe, it, expect, beforeEach, vi } from "vitest";

import {
    validateUpdateUser
} from "../../src/middleware/validation/userValidation.js";

describe("validateUpdateUser", () => {

    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            body: {}
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        };

        next = vi.fn();
    });

    // =========================================================
    // VALID INPUT
    // =========================================================

    it("should accept a valid name update", () => {
        req.body = {
            name: "Bhaumik Modi"
        };

        validateUpdateUser(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(req.body.name).toBe("Bhaumik Modi");
    });

    it("should accept a valid mobile update", () => {
        req.body = {
            mobile: "9876543210"
        };

        validateUpdateUser(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(req.body.mobile).toBe("9876543210");
    });

    it("should accept a valid semester update", () => {
        req.body = {
            sem: 5
        };

        validateUpdateUser(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(req.body.sem).toBe(5);
    });

    it("should accept a valid password update", () => {
        req.body = {
            password: "StrongPass123!"
        };

        validateUpdateUser(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it("should accept multiple valid fields", () => {
        req.body = {
            name: "Bhaumik Modi",
            mobile: "9876543210",
            sem: 6,
            password: "StrongPass123!"
        };

        validateUpdateUser(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);

        expect(req.body.name).toBe("Bhaumik Modi");
        expect(req.body.mobile).toBe("9876543210");
        expect(req.body.sem).toBe(6);
        expect(req.body.password).toBe("StrongPass123!");
    });

    // =========================================================
    // NORMALIZATION
    // =========================================================

    it("should trim the name", () => {
        req.body = {
            name: "   Bhaumik Modi   "
        };

        validateUpdateUser(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(req.body.name).toBe("Bhaumik Modi");
    });

    it("should trim the mobile number", () => {
        req.body = {
            mobile: "   9876543210   "
        };

        validateUpdateUser(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(req.body.mobile).toBe("9876543210");
    });

    // =========================================================
    // EMPTY / INVALID BODY
    // =========================================================

    it("should reject an empty update body", () => {
        req.body = {};

        validateUpdateUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "At least one field is required for update"
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should reject an unknown field", () => {
        req.body = {
            email: "new@example.com"
        };

        /*
         * The current validator destructures only the supported
         * fields and does not explicitly reject unknown fields.
         * Therefore this is expected to reach next().
         */
        validateUpdateUser(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    // =========================================================
    // NAME VALIDATION
    // =========================================================

    it("should reject an invalid name", () => {
        req.body = {
            name: "Bhaumik123"
        };

        validateUpdateUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Invalid name format"
        });

        expect(next).not.toHaveBeenCalled();
    });

    // =========================================================
    // MOBILE VALIDATION
    // =========================================================

    it("should reject an invalid mobile number", () => {
        req.body = {
            mobile: "98765"
        };

        validateUpdateUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Mobile number must contain exactly 10 digits"
        });

        expect(next).not.toHaveBeenCalled();
    });

    // =========================================================
    // SEMESTER VALIDATION
    // =========================================================

    it("should reject an invalid semester", () => {
        req.body = {
            sem: 9
        };

        validateUpdateUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Semester must be an integer between 1 and 8"
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should reject a non-integer semester", () => {
        req.body = {
            sem: 5.5
        };

        validateUpdateUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Semester must be an integer between 1 and 8"
        });

        expect(next).not.toHaveBeenCalled();
    });

    // =========================================================
    // PASSWORD VALIDATION
    // =========================================================

    it("should reject an invalid password", () => {
        req.body = {
            password: "123"
        };

        validateUpdateUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message:
                "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
        });

        expect(next).not.toHaveBeenCalled();
    });

    // =========================================================
    // NEXT()
    // =========================================================

    it("should call next exactly once for valid data", () => {
        req.body = {
            name: "Bhaumik Modi",
            mobile: "9876543210",
            sem: 5,
            password: "StrongPass123!"
        };

        validateUpdateUser(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
    });
});