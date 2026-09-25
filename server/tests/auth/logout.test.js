
import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";

import app from "../../src/app.js";
import authService from "../../src/services/authService.js";

vi.mock("../../src/services/authService.js", () => ({
    default: {
        registerUser: vi.fn(),
        loginUser: vi.fn(),
        logoutUser: vi.fn(),
        refreshAccessToken: vi.fn(),
    },
}));

vi.mock("../../src/middleware/authMiddleware.js", () => ({
    default: (req, res, next) => {
        req.user = {
            userId: "STU001",
            jti: "mock-access-token-id",
            exp: Math.floor(Date.now() / 1000) + 900,
        };

        next();
    },
}));

describe("POST /auth/logout", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should logout successfully with a valid session", async () => {
        authService.logoutUser.mockResolvedValue({
            message: "Logout successful",
        });

        const response = await request(app)
            .post("/auth/logout")
            .set(
                "Cookie",
                "refreshToken=valid-refresh-token"
            );

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            success: true,
            message: "Logout successful",
        });
    });

    it("should return the successful logout message", async () => {
        authService.logoutUser.mockResolvedValue({
            message: "Logout successful",
        });

        const response = await request(app)
            .post("/auth/logout")
            .set(
                "Cookie",
                "refreshToken=logout-refresh-token"
            );

        expect(response.status).toBe(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe(
            "Logout successful"
        );
    });

    it("should pass the refresh token from the cookie to the logout service", async () => {
        authService.logoutUser.mockResolvedValue({
            message: "Logout successful",
        });

        const refreshToken = "specific-refresh-token-123";

        const response = await request(app)
            .post("/auth/logout")
            .set(
                "Cookie",
                `refreshToken=${refreshToken}`
            );

        expect(response.status).toBe(200);

        expect(authService.logoutUser).toHaveBeenCalledTimes(1);

        expect(authService.logoutUser).toHaveBeenCalledWith(
            refreshToken,
            expect.objectContaining({
                userId: "STU001",
                jti: "mock-access-token-id",
            })
        );
    });

    it("should pass the decoded access-token payload from authMiddleware to the logout service", async () => {
        authService.logoutUser.mockResolvedValue({
            message: "Logout successful",
        });

        const response = await request(app)
            .post("/auth/logout")
            .set(
                "Cookie",
                "refreshToken=valid-refresh-token"
            );

        expect(response.status).toBe(200);

        expect(authService.logoutUser).toHaveBeenCalledWith(
            "valid-refresh-token",
            expect.objectContaining({
                userId: "STU001",
                jti: "mock-access-token-id",
            })
        );
    });

    it("should clear the refresh-token cookie after successful logout", async () => {
        authService.logoutUser.mockResolvedValue({
            message: "Logout successful",
        });

        const response = await request(app)
            .post("/auth/logout")
            .set(
                "Cookie",
                "refreshToken=refresh-token-to-clear"
            );

        expect(response.status).toBe(200);

        const cookies = response.headers["set-cookie"];

        expect(cookies).toBeDefined();
        expect(cookies.length).toBeGreaterThan(0);

        const refreshCookie = cookies.find((cookie) =>
            cookie.startsWith("refreshToken=")
        );

        expect(refreshCookie).toBeDefined();

        /*
         * Express clearCookie() sends the cookie with an expired
         * date and an empty value.
         */
        expect(refreshCookie).toContain("refreshToken=");
        expect(refreshCookie.toLowerCase()).toContain(
            "expires="
        );
    });

    it("should return 401 when there is no active refresh-token session", async () => {
        const error = new Error("No active session found");
        error.statusCode = 401;

        authService.logoutUser.mockRejectedValue(error);

        const response = await request(app)
            .post("/auth/logout");

        expect(response.status).toBe(401);

        expect(response.body).toEqual({
            success: false,
            message: "No active session found",
        });

        expect(authService.logoutUser).toHaveBeenCalledWith(
            undefined,
            expect.objectContaining({
                jti: "mock-access-token-id",
            })
        );
    });

    it("should return 401 when the access token is invalid", async () => {
        const error = new Error("Invalid access token");
        error.statusCode = 401;

        authService.logoutUser.mockRejectedValue(error);

        const response = await request(app)
            .post("/auth/logout")
            .set(
                "Cookie",
                "refreshToken=valid-refresh-token"
            );

        expect(response.status).toBe(401);

        expect(response.body).toEqual({
            success: false,
            message: "Invalid access token",
        });
    });

    it("should return 401 when the session has already been logged out", async () => {
        const error = new Error(
            "Session not found or already logged out"
        );
        error.statusCode = 401;

        authService.logoutUser.mockRejectedValue(error);

        const response = await request(app)
            .post("/auth/logout")
            .set(
                "Cookie",
                "refreshToken=already-logged-out-token"
            );

        expect(response.status).toBe(401);

        expect(response.body).toEqual({
            success: false,
            message: "Session not found or already logged out",
        });
    });

    it("should return 500 when the logout service throws an unknown error", async () => {
        authService.logoutUser.mockRejectedValue(
            new Error("Unexpected database failure")
        );

        const response = await request(app)
            .post("/auth/logout")
            .set(
                "Cookie",
                "refreshToken=valid-refresh-token"
            );

        expect(response.status).toBe(500);

        expect(response.body).toEqual({
            success: false,
            message: "Unexpected database failure",
        });
    });

    it("should call the logout service exactly once", async () => {
        authService.logoutUser.mockResolvedValue({
            message: "Logout successful",
        });

        const response = await request(app)
            .post("/auth/logout")
            .set(
                "Cookie",
                "refreshToken=single-call-token"
            );

        expect(response.status).toBe(200);

        expect(authService.logoutUser).toHaveBeenCalledTimes(1);
    });
});
