import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";

import app from "../../src/app.js";

import {
    createDepartmentService,
    getDepartmentsService,
    updateDepartmentService,
    deleteDepartmentService,
} from "../../src/services/DepartmentService.js";

vi.mock("../../src/services/DepartmentService.js", () => ({
    createDepartmentService: vi.fn(),
    getDepartmentsService: vi.fn(),
    updateDepartmentService: vi.fn(),
    deleteDepartmentService: vi.fn(),
}));

vi.mock("../../src/middleware/authMiddleware.js", () => ({
    default: (req, res, next) => {
        req.user = {
            userId: "ADMIN001",
            role: "ADMIN",
            jti: "mock-admin-jti",
        };

        next();
    },
}));

vi.mock("../../src/middleware/roleMiddleware.js", () => ({
    default: (...allowedRoles) => {
        return (req, res, next) => {
            if (!req.user) {
                return res.status(401).json({
                    message: "Authentication required",
                });
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    message:
                        "You are not authorized to perform this action",
                });
            }

            next();
        };
    },
}));

describe("Department API", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("GET /departments/", () => {
        it("should return all departments successfully", async () => {
            const departments = [
                {
                    deptId: 1,
                    deptName: "computer engineering",
                },
                {
                    deptId: 2,
                    deptName: "information technology",
                },
            ];

            getDepartmentsService.mockResolvedValue(
                departments
            );

            const response = await request(app)
                .get("/departments/");

            expect(response.status).toBe(200);

            expect(response.body).toEqual({
                departments,
            });

            expect(
                getDepartmentsService
            ).toHaveBeenCalledTimes(1);
        });

        it("should return the departments array in the response", async () => {
            getDepartmentsService.mockResolvedValue([
                {
                    deptId: 1,
                    deptName: "computer engineering",
                },
            ]);

            const response = await request(app)
                .get("/departments/");

            expect(response.status).toBe(200);

            expect(response.body).toHaveProperty(
                "departments"
            );

            expect(
                Array.isArray(response.body.departments)
            ).toBe(true);
        });

        it("should return 500 when fetching departments fails unexpectedly", async () => {
            getDepartmentsService.mockRejectedValue(
                new Error("Database connection failed")
            );

            const response = await request(app)
                .get("/departments/");

            expect(response.status).toBe(500);

            expect(response.body).toEqual({
                message: "Database connection failed",
            });
        });
    });

    describe("POST /departments/", () => {
        it("should create a department successfully", async () => {
            const department = {
                deptId: 3,
                deptName: "mechanical engineering",
            };

            createDepartmentService.mockResolvedValue(
                department
            );

            const response = await request(app)
                .post("/departments/")
                .send({
                    deptName: "mechanical engineering",
                });

            expect(response.status).toBe(201);

            expect(response.body).toEqual({
                message: "Department created successfully",
                department,
            });

            expect(
                createDepartmentService
            ).toHaveBeenCalledTimes(1);

            expect(
                createDepartmentService
            ).toHaveBeenCalledWith(
                "mechanical engineering"
            );
        });

        it("should trim the department name before passing it to the service", async () => {
            createDepartmentService.mockResolvedValue({
                deptId: 4,
                deptName: "civil engineering",
            });

            const response = await request(app)
                .post("/departments/")
                .send({
                    deptName: "   civil engineering   ",
                });

            expect(response.status).toBe(201);

            expect(
                createDepartmentService
            ).toHaveBeenCalledWith(
                "civil engineering"
            );
        });

        it("should return 409 when the department already exists", async () => {
            const error = new Error(
                "Department with this name already exists"
            );

            error.statusCode = 409;

            createDepartmentService.mockRejectedValue(
                error
            );

            const response = await request(app)
                .post("/departments/")
                .send({
                    deptName: "computer engineering",
                });

            expect(response.status).toBe(409);

            expect(response.body).toEqual({
                message:
                    "Department with this name already exists",
            });
        });

        it("should reject an invalid department name", async () => {
            const response = await request(app)
                .post("/departments/")
                .send({
                    deptName: "Computer@Engineering",
                });

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                success: false,
                message: "Invalid department name format",
            });

            expect(
                createDepartmentService
            ).not.toHaveBeenCalled();
        });

        it("should reject a request when department name is missing", async () => {
            const response = await request(app)
                .post("/departments/")
                .send({});

            expect(response.status).toBe(400);

            expect(response.body).toEqual({
                success: false,
                message: "Department name is required",
            });

            expect(
                createDepartmentService
            ).not.toHaveBeenCalled();
        });
    });

    describe("PATCH /departments/:id", () => {
        it("should update a department successfully", async () => {
            const department = {
                deptId: 1,
                deptName: "updated engineering",
            };

            updateDepartmentService.mockResolvedValue(
                department
            );

            const response = await request(app)
                .patch("/departments/1")
                .send({
                    deptName: "updated engineering",
                });

            expect(response.status).toBe(200);

            expect(response.body).toEqual({
                message: "Department updated successfully",
                department,
            });

            expect(
                updateDepartmentService
            ).toHaveBeenCalledTimes(1);

            expect(
                updateDepartmentService
            ).toHaveBeenCalledWith(
                "1",
                "updated engineering"
            );
        });

        it("should trim the department name before updating", async () => {
            updateDepartmentService.mockResolvedValue({
                deptId: 2,
                deptName: "electronics engineering",
            });

            const response = await request(app)
                .patch("/departments/2")
                .send({
                    deptName: "   electronics engineering   ",
                });

            expect(response.status).toBe(200);

            expect(
                updateDepartmentService
            ).toHaveBeenCalledWith(
                "2",
                "electronics engineering"
            );
        });

        it("should return 404 when the department does not exist", async () => {
            const error = new Error("Department not found");

            error.statusCode = 404;

            updateDepartmentService.mockRejectedValue(
                error
            );

            const response = await request(app)
                .patch("/departments/999")
                .send({
                    deptName: "unknown department",
                });

            expect(response.status).toBe(404);

            expect(response.body).toEqual({
                message: "Department not found",
            });
        });
    });

    describe("DELETE /departments/:id", () => {
        it("should delete a department successfully", async () => {
            deleteDepartmentService.mockResolvedValue(
                undefined
            );

            const response = await request(app)
                .delete("/departments/1");

            expect(response.status).toBe(200);

            expect(response.body).toEqual({
                message: "Department deleted successfully",
            });

            expect(
                deleteDepartmentService
            ).toHaveBeenCalledTimes(1);

            expect(
                deleteDepartmentService
            ).toHaveBeenCalledWith("1");
        });

        it("should return 404 when the department to delete does not exist", async () => {
            const error = new Error("Department not found");

            error.statusCode = 404;

            deleteDepartmentService.mockRejectedValue(
                error
            );

            const response = await request(app)
                .delete("/departments/999");

            expect(response.status).toBe(404);

            expect(response.body).toEqual({
                message: "Department not found",
            });
        });

        it("should return 500 when deleting a department fails unexpectedly", async () => {
            deleteDepartmentService.mockRejectedValue(
                new Error("Database deletion failed")
            );

            const response = await request(app)
                .delete("/departments/1");

            expect(response.status).toBe(500);

            expect(response.body).toEqual({
                message: "Database deletion failed",
            });
        });
    });
});

