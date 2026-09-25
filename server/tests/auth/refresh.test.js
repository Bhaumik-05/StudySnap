
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

describe("POST /auth/refresh", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should refresh the access token successfully", async () => {
        authService.refreshAccessToken.mockResolvedValue({
            accessToken: "new-access-token",
        });

        const response = await request(app)
            .post("/auth/refresh")
            .set(
                "Cookie",
                "refreshToken=valid-refresh-token"
            );

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            success: true,
            message: "Access token refreshed successfully",
            data: {
                accessToken: "new-access-token",
            },
        });
    });

    it("should return the new access token in the response", async () => {
        authService.refreshAccessToken.mockResolvedValue({
            accessToken: "unique-new-access-token",
        });

        const response = await request(app)
            .post("/auth/refresh")
            .set(
                "Cookie",
                "refreshToken=valid-refresh-token"
            );

        expect(response.status).toBe(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe(
            "Access token refreshed successfully"
        );

        expect(response.body.data).toHaveProperty(
            "accessToken",
            "unique-new-access-token"
        );
    });

    it("should read the refresh token from the request cookie", async () => {
        authService.refreshAccessToken.mockResolvedValue({
            accessToken: "cookie-access-token",
        });

        const response = await request(app)
            .post("/auth/refresh")
            .set(
                "Cookie",
                "refreshToken=cookie-refresh-token"
            );

        expect(response.status).toBe(200);

        expect(authService.refreshAccessToken).toHaveBeenCalledWith(
            "cookie-refresh-token"
        );
    });

    it("should pass the exact refresh token to the authentication service", async () => {
        authService.refreshAccessToken.mockResolvedValue({
            accessToken: "argument-access-token",
        });

        const refreshToken = "specific-refresh-token-123";

        const response = await request(app)
            .post("/auth/refresh")
            .set(
                "Cookie",
                `refreshToken=${refreshToken}`
            );

        expect(response.status).toBe(200);

        expect(authService.refreshAccessToken).toHaveBeenCalledTimes(1);
        expect(authService.refreshAccessToken).toHaveBeenCalledWith(
            refreshToken
        );
    });

    it("should return 401 when the refresh token is missing", async () => {
        const error = new Error("Refresh token is required");
        error.statusCode = 401;

        authService.refreshAccessToken.mockRejectedValue(error);

        const response = await request(app)
            .post("/auth/refresh");

        expect(response.status).toBe(401);

        expect(response.body).toEqual({
            success: false,
            message: "Refresh token is required",
        });

        expect(authService.refreshAccessToken).toHaveBeenCalledWith(
            undefined
        );
    });

    it("should return 401 when the refresh token is invalid or expired", async () => {
        const error = new Error(
            "Invalid or expired refresh token"
        );
        error.statusCode = 401;

        authService.refreshAccessToken.mockRejectedValue(error);

        const response = await request(app)
            .post("/auth/refresh")
            .set(
                "Cookie",
                "refreshToken=invalid-refresh-token"
            );

        expect(response.status).toBe(401);

        expect(response.body).toEqual({
            success: false,
            message: "Invalid or expired refresh token",
        });
    });

    it("should return 401 when the refresh session has expired", async () => {
        const error = new Error("Session has expired");
        error.statusCode = 401;

        authService.refreshAccessToken.mockRejectedValue(error);

        const response = await request(app)
            .post("/auth/refresh")
            .set(
                "Cookie",
                "refreshToken=expired-session-token"
            );

        expect(response.status).toBe(401);

        expect(response.body).toEqual({
            success: false,
            message: "Session has expired",
        });
    });

    it("should return 404 when the user associated with the refresh token does not exist", async () => {
        const error = new Error("User not found");
        error.statusCode = 404;

        authService.refreshAccessToken.mockRejectedValue(error);

        const response = await request(app)
            .post("/auth/refresh")
            .set(
                "Cookie",
                "refreshToken=valid-but-user-missing-token"
            );

        expect(response.status).toBe(404);

        expect(response.body).toEqual({
            success: false,
            message: "User not found",
        });
    });

    it("should return 500 when the refresh service throws an unknown error", async () => {
        authService.refreshAccessToken.mockRejectedValue(
            new Error("Unexpected database failure")
        );

        const response = await request(app)
            .post("/auth/refresh")
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

    it("should not set a new refresh-token cookie when refreshing the access token", async () => {
        authService.refreshAccessToken.mockResolvedValue({
            accessToken: "refreshed-access-token",
        });

        const response = await request(app)
            .post("/auth/refresh")
            .set(
                "Cookie",
                "refreshToken=existing-refresh-token"
            );

        expect(response.status).toBe(200);

        const cookies = response.headers["set-cookie"];

        expect(cookies).toBeUndefined();
    });
});
