import { describe, it, expect, vi } from "vitest";

import roleMiddleware from "../../src/middleware/roleMiddleware.js";

describe("roleMiddleware", () => {
    it("should allow a user whose role is authorized", () => {
        const req = {
            user: {
                userId: "ADMIN001",
                role: "ADMIN",
            },
        };

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };

        const next = vi.fn();

        const middleware = roleMiddleware("ADMIN");

        middleware(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it("should allow a user when their role matches one of multiple allowed roles", () => {
        const req = {
            user: {
                userId: "FAC001",
                role: "FACULTY",
            },
        };

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };

        const next = vi.fn();

        const middleware = roleMiddleware(
            "ADMIN",
            "FACULTY",
            "STUDENT"
        );

        middleware(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it("should reject a user whose role is not authorized", () => {
        const req = {
            user: {
                userId: "STU001",
                role: "STUDENT",
            },
        };

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };

        const next = vi.fn();

        const middleware = roleMiddleware("ADMIN");

        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);

        expect(res.json).toHaveBeenCalledWith({
            message: "You are not authorized to perform this action",
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 when req.user is missing", () => {
        const req = {};

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };

        const next = vi.fn();

        const middleware = roleMiddleware("ADMIN");

        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);

        expect(res.json).toHaveBeenCalledWith({
            message: "Authentication required",
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should reject a user whose role is missing", () => {
        const req = {
            user: {
                userId: "USER001",
            },
        };

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };

        const next = vi.fn();

        const middleware = roleMiddleware("ADMIN");

        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);

        expect(res.json).toHaveBeenCalledWith({
            message: "You are not authorized to perform this action",
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should treat roles as case-sensitive", () => {
        const req = {
            user: {
                userId: "ADMIN001",
                role: "admin",
            },
        };

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };

        const next = vi.fn();

        const middleware = roleMiddleware("ADMIN");

        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);

        expect(res.json).toHaveBeenCalledWith({
            message: "You are not authorized to perform this action",
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should reject an authenticated user when no roles are allowed", () => {
        const req = {
            user: {
                userId: "STU001",
                role: "STUDENT",
            },
        };

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };

        const next = vi.fn();

        const middleware = roleMiddleware();

        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);

        expect(res.json).toHaveBeenCalledWith({
            message: "You are not authorized to perform this action",
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should call next exactly once for an authorized user", () => {
        const req = {
            user: {
                userId: "STU002",
                role: "STUDENT",
            },
        };

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };

        const next = vi.fn();

        const middleware = roleMiddleware(
            "STUDENT",
            "FACULTY"
        );

        middleware(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
    });
});

