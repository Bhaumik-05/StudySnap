import { describe, it, expect, beforeEach, vi } from "vitest";

import jwt from "jsonwebtoken";
import authMiddleware from "../../src/middleware/authMiddleware.js";
import { isAccessTokenBlacklisted } from "../../src/utils/tokenBlacklist.js";

vi.mock("jsonwebtoken", () => ({
    default: {
        verify: vi.fn(),
    },
}));

vi.mock("../../src/utils/tokenBlacklist.js", () => ({
    isAccessTokenBlacklisted: vi.fn(),
}));

describe("authMiddleware", () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        vi.clearAllMocks();

        req = {
            headers: {},
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };

        next = vi.fn();
    });

    it("should return 401 when the Authorization header is missing", async () => {
        await authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Authorization token is required",
        });

        expect(next).not.toHaveBeenCalled();
        expect(jwt.verify).not.toHaveBeenCalled();
    });

    it("should return 401 when the Authorization header does not use Bearer authentication", async () => {
        req.headers.authorization = "Basic some-token";

        await authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Authorization token is required",
        });

        expect(next).not.toHaveBeenCalled();
        expect(jwt.verify).not.toHaveBeenCalled();
    });

    it("should return 401 when the Bearer token is empty", async () => {
        req.headers.authorization = "Bearer ";

        jwt.verify.mockImplementation(() => {
            throw new Error("jwt malformed");
        });

        await authMiddleware(req, res, next);

        expect(jwt.verify).toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(401);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Invalid or expired token",
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 when JWT verification fails", async () => {
        req.headers.authorization = "Bearer invalid-token";

        jwt.verify.mockImplementation(() => {
            throw new Error("invalid signature");
        });

        await authMiddleware(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith(
            "invalid-token",
            expect.any(String)
        );

        expect(res.status).toHaveBeenCalledWith(401);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Invalid or expired token",
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 when the JWT is expired", async () => {
        req.headers.authorization = "Bearer expired-token";

        const expiredError = new Error("jwt expired");
        expiredError.name = "TokenExpiredError";

        jwt.verify.mockImplementation(() => {
            throw expiredError;
        });

        await authMiddleware(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith(
            "expired-token",
            expect.any(String)
        );

        expect(res.status).toHaveBeenCalledWith(401);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Invalid or expired token",
        });

        expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 when the access token is blacklisted", async () => {
        req.headers.authorization = "Bearer blacklisted-token";

        jwt.verify.mockReturnValue({
            userId: "STU001",
            role: "STUDENT",
            jti: "blacklisted-jti",
            exp: 9999999999,
        });

        isAccessTokenBlacklisted.mockResolvedValue(true);

        await authMiddleware(req, res, next);

        expect(isAccessTokenBlacklisted).toHaveBeenCalledWith(
            "blacklisted-jti"
        );

        expect(res.status).toHaveBeenCalledWith(401);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message:
                "Access token has been revoked. Please login again.",
        });

        expect(next).not.toHaveBeenCalled();
        expect(req.user).toBeUndefined();
        expect(req.accessToken).toBeUndefined();
    });

    it("should allow a valid non-blacklisted access token", async () => {
        const decodedToken = {
            userId: "STU001",
            role: "STUDENT",
            jti: "valid-jti",
            exp: 9999999999,
        };

        req.headers.authorization = "Bearer valid-access-token";

        jwt.verify.mockReturnValue(decodedToken);
        isAccessTokenBlacklisted.mockResolvedValue(false);

        await authMiddleware(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith(
            "valid-access-token",
            expect.any(String)
        );

        expect(isAccessTokenBlacklisted).toHaveBeenCalledWith(
            "valid-jti"
        );

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it("should attach the decoded JWT payload to req.user", async () => {
        const decodedToken = {
            userId: "FAC001",
            role: "FACULTY",
            jti: "faculty-jti",
            exp: 9999999999,
        };

        req.headers.authorization = "Bearer faculty-access-token";

        jwt.verify.mockReturnValue(decodedToken);
        isAccessTokenBlacklisted.mockResolvedValue(false);

        await authMiddleware(req, res, next);

        expect(req.user).toEqual(decodedToken);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("should attach the original access token to req.accessToken", async () => {
        const accessToken = "original-access-token";

        req.headers.authorization = `Bearer ${accessToken}`;

        jwt.verify.mockReturnValue({
            userId: "STU002",
            role: "STUDENT",
            jti: "student-jti",
            exp: 9999999999,
        });

        isAccessTokenBlacklisted.mockResolvedValue(false);

        await authMiddleware(req, res, next);

        expect(req.accessToken).toBe(accessToken);
        expect(next).toHaveBeenCalledTimes(1);
    });

    it("should return 401 when the blacklist lookup throws an error", async () => {
        req.headers.authorization = "Bearer valid-token";

        jwt.verify.mockReturnValue({
            userId: "STU003",
            role: "STUDENT",
            jti: "redis-error-jti",
            exp: 9999999999,
        });

        isAccessTokenBlacklisted.mockRejectedValue(
            new Error("Redis connection failed")
        );

        await authMiddleware(req, res, next);

        expect(isAccessTokenBlacklisted).toHaveBeenCalledWith(
            "redis-error-jti"
        );

        expect(res.status).toHaveBeenCalledWith(401);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Invalid or expired token",
        });

        expect(next).not.toHaveBeenCalled();
    });
});

