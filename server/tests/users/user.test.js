import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";

import app from "../../src/app.js";
import userService from "../../src/services/userService.js";

vi.mock("../../src/services/userService.js", () => ({
    default: {
        getProfile: vi.fn(),
        updateProfile: vi.fn(),
    },
}));

vi.mock("../../src/middleware/authMiddleware.js", () => ({
    default: (req, res, next) => {
        req.user = {
            userId: "STU001",
            role: "STUDENT",
            jti: "mock-user-jti",
        };

        next();
    },
}));

describe("User Profile", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("GET /users/me", () => {
        it("should fetch the authenticated user's profile successfully", async () => {
            const user = {
                userId: "STU001",
                name: "Bhaumik Modi",
                email: "bhaumik@example.com",
                role: "STUDENT",
                sem: 5,
                mobile: "9876543210",
                deptId: 101,
            };

            userService.getProfile.mockResolvedValue(user);

            const response = await request(app)
                .get("/users/me")
                .set(
                    "Authorization",
                    "Bearer mock-access-token"
                );

            expect(response.status).toBe(200);

            expect(response.body).toEqual({
                success: true,
                message: "Profile fetched successfully",
                data: user,
            });
        });

        it("should return the expected profile response structure", async () => {
            userService.getProfile.mockResolvedValue({
                userId: "STU002",
                name: "Test Student",
                email: "student@example.com",
                role: "STUDENT",
                sem: 4,
                deptId: 102,
            });

            const response = await request(app)
                .get("/users/me")
                .set(
                    "Authorization",
                    "Bearer mock-access-token"
                );

            expect(response.status).toBe(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe(
                "Profile fetched successfully"
            );
            expect(response.body).toHaveProperty("data");
            expect(response.body.data).toHaveProperty(
                "userId"
            );
            expect(response.body.data).toHaveProperty(
                "email"
            );
        });

        it("should pass the authenticated user's ID to getProfile", async () => {
            userService.getProfile.mockResolvedValue({
                userId: "STU001",
                name: "Bhaumik Modi",
                email: "bhaumik@example.com",
                role: "STUDENT",
                sem: 5,
                deptId: 101,
            });

            const response = await request(app)
                .get("/users/me")
                .set(
                    "Authorization",
                    "Bearer mock-access-token"
                );

            expect(response.status).toBe(200);

            expect(userService.getProfile).toHaveBeenCalledTimes(
                1
            );

            expect(userService.getProfile).toHaveBeenCalledWith(
                "STU001"
            );
        });

        it("should return 404 when the user profile does not exist", async () => {
            const error = new Error("User not found");
            error.statusCode = 404;

            userService.getProfile.mockRejectedValue(error);

            const response = await request(app)
                .get("/users/me")
                .set(
                    "Authorization",
                    "Bearer mock-access-token"
                );

            expect(response.status).toBe(404);

            expect(response.body).toEqual({
                success: false,
                message: "User not found",
            });
        });

        it("should return 500 when fetching the profile throws an unknown error", async () => {
            userService.getProfile.mockRejectedValue(
                new Error("Unexpected database failure")
            );

            const response = await request(app)
                .get("/users/me")
                .set(
                    "Authorization",
                    "Bearer mock-access-token"
                );

            expect(response.status).toBe(500);

            expect(response.body).toEqual({
                success: false,
                message: "Unexpected database failure",
            });
        });
    });

    describe("PATCH /users/me", () => {
        it("should update the authenticated user's profile successfully", async () => {
            const updatedUser = {
                userId: "STU001",
                name: "Bhaumik Modi Updated",
                email: "bhaumik@example.com",
                role: "STUDENT",
                sem: 6,
                mobile: "9876543210",
                deptId: 101,
            };

            userService.updateProfile.mockResolvedValue(
                updatedUser
            );

            const updateData = {
                name: "Bhaumik Modi Updated",
                sem: 6,
                mobile: "9876543210",
            };

            const response = await request(app)
                .patch("/users/me")
                .set(
                    "Authorization",
                    "Bearer mock-access-token"
                )
                .send(updateData);

            expect(response.status).toBe(200);

            expect(response.body).toEqual({
                success: true,
                message: "Profile updated successfully",
                data: updatedUser,
            });
        });

        it("should return the expected updated-profile response structure", async () => {
            userService.updateProfile.mockResolvedValue({
                userId: "STU001",
                name: "Updated User",
                email: "updated@example.com",
                role: "STUDENT",
                sem: 5,
                deptId: 101,
            });

            const response = await request(app)
                .patch("/users/me")
                .set(
                    "Authorization",
                    "Bearer mock-access-token"
                )
                .send({
                    name: "Updated User",
                });

            expect(response.status).toBe(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe(
                "Profile updated successfully"
            );
            expect(response.body).toHaveProperty("data");
        });

        it("should pass the authenticated user's ID and update data to the service", async () => {
            userService.updateProfile.mockResolvedValue({
                userId: "STU001",
                name: "New Name",
                email: "bhaumik@example.com",
                role: "STUDENT",
                sem: 5,
                deptId: 101,
            });

            const updateData = {
                name: "New Name",
            };

            const response = await request(app)
                .patch("/users/me")
                .set(
                    "Authorization",
                    "Bearer mock-access-token"
                )
                .send(updateData);

            expect(response.status).toBe(200);

            expect(userService.updateProfile).toHaveBeenCalledTimes(
                1
            );

            expect(userService.updateProfile).toHaveBeenCalledWith(
                "STU001",
                {
                    name: "New Name",
                }
            );
        });

        it("should allow multiple valid profile fields to be updated together", async () => {
            userService.updateProfile.mockResolvedValue({
                userId: "STU001",
                name: "Updated Name",
                email: "bhaumik@example.com",
                role: "STUDENT",
                sem: 7,
                mobile: "9123456789",
                deptId: 101,
            });

            const updateData = {
                name: "Updated Name",
                mobile: "9123456789",
                sem: 7,
                password: "NewPassword@123",
            };

            const response = await request(app)
                .patch("/users/me")
                .set(
                    "Authorization",
                    "Bearer mock-access-token"
                )
                .send(updateData);

            expect(response.status).toBe(200);

            expect(userService.updateProfile).toHaveBeenCalledWith(
                "STU001",
                updateData
            );
        });

        it("should return 400 when the service rejects an unauthorized update field", async () => {
            const error = new Error(
                "Cannot update field: role"
            );
            error.statusCode = 400;

            userService.updateProfile.mockRejectedValue(error);

            const response = await request(app)
                .patch("/users/me")
                .set(
                    "Authorization",
                    "Bearer mock-access-token"
                )
                .send({
                    role: "ADMIN",
                });

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                success: false,
                message: "Cannot update field: role",
            });
        });

        it("should return 404 when the user being updated does not exist", async () => {
            const error = new Error("User not found");
            error.statusCode = 404;

            userService.updateProfile.mockRejectedValue(error);

            const response = await request(app)
                .patch("/users/me")
                .set(
                    "Authorization",
                    "Bearer mock-access-token"
                )
                .send({
                    name: "Updated Name",
                });

            expect(response.status).toBe(404);

            expect(response.body).toEqual({
                success: false,
                message: "User not found",
            });
        });

        it("should return 500 when updating the profile throws an unknown error", async () => {
            userService.updateProfile.mockRejectedValue(
                new Error("Unexpected database failure")
            );

            const response = await request(app)
                .patch("/users/me")
                .set(
                    "Authorization",
                    "Bearer mock-access-token"
                )
                .send({
                    name: "Updated Name",
                });

            expect(response.status).toBe(500);

            expect(response.body).toEqual({
                success: false,
                message: "Unexpected database failure",
            });
        });
    });
});

