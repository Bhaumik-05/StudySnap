import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("../../src/services/DepartmentService.js", () => ({
    createDepartmentService: vi.fn(),
    getDepartmentsService: vi.fn(),
    updateDepartmentService: vi.fn(),
    deleteDepartmentService: vi.fn()
}));

import {
    createDepartment,
    getDepartments,
    updateDepartment,
    deleteDepartment
} from "../../src/controller/DepartmentController.js";

import {
    createDepartmentService,
    getDepartmentsService,
    updateDepartmentService,
    deleteDepartmentService
} from "../../src/services/DepartmentService.js";

describe("Department Controller", () => {

    let req;
    let res;

    beforeEach(() => {
        vi.clearAllMocks();

        req = {
            body: {},
            params: {}
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        };
    });

    // =========================================================
    // GET /departments
    // =========================================================

    describe("getDepartments", () => {

        it("should return all departments successfully", async () => {
            const departments = [
                { deptId: 1, deptName: "computer engineering" },
                { deptId: 2, deptName: "information technology" }
            ];

            getDepartmentsService.mockResolvedValue(departments);

            await getDepartments(req, res);

            expect(getDepartmentsService).toHaveBeenCalledTimes(1);

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                departments
            });
        });

        it("should return departments inside the response object", async () => {
            const departments = [
                { deptId: 1, deptName: "computer engineering" }
            ];

            getDepartmentsService.mockResolvedValue(departments);

            await getDepartments(req, res);

            const response = res.json.mock.calls[0][0];

            expect(response).toHaveProperty("departments");
            expect(response.departments).toEqual(departments);
        });

        it("should return service error when fetching departments fails", async () => {
            const error = new Error("Database error");
            error.statusCode = 500;

            getDepartmentsService.mockRejectedValue(error);

            await getDepartments(req, res);

            expect(res.status).toHaveBeenCalledWith(500);

            expect(res.json).toHaveBeenCalledWith({
                message: "Database error"
            });
        });
    });

    // =========================================================
    // POST /departments
    // =========================================================

    describe("createDepartment", () => {

        it("should create a department successfully", async () => {
            req.body = {
                deptName: "Computer Engineering"
            };

            const department = {
                deptId: 1,
                deptName: "computer engineering"
            };

            createDepartmentService.mockResolvedValue(department);

            await createDepartment(req, res);

            expect(res.status).toHaveBeenCalledWith(201);

            expect(res.json).toHaveBeenCalledWith({
                message: "Department created successfully",
                department
            });
        });

        it("should pass department name to the service", async () => {
            req.body = {
                deptName: "Computer Engineering"
            };

            const department = {
                deptId: 1,
                deptName: "computer engineering"
            };

            createDepartmentService.mockResolvedValue(department);

            await createDepartment(req, res);

            expect(createDepartmentService).toHaveBeenCalledTimes(1);
            expect(createDepartmentService).toHaveBeenCalledWith(
                "Computer Engineering"
            );
        });

        it("should return service error when department creation fails", async () => {
            req.body = {
                deptName: "Computer Engineering"
            };

            const error = new Error(
                "Department with this name already exists"
            );
            error.statusCode = 409;

            createDepartmentService.mockRejectedValue(error);

            await createDepartment(req, res);

            expect(res.status).toHaveBeenCalledWith(409);

            expect(res.json).toHaveBeenCalledWith({
                message: "Department with this name already exists"
            });
        });
    });

    // =========================================================
    // PATCH /departments/:id
    // =========================================================

    describe("updateDepartment", () => {

        it("should update a department successfully", async () => {
            req.params = {
                id: "1"
            };

            req.body = {
                deptName: "Computer Science"
            };

            const department = {
                deptId: 1,
                deptName: "computer science"
            };

            updateDepartmentService.mockResolvedValue(department);

            await updateDepartment(req, res);

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                message: "Department updated successfully",
                department
            });
        });

        it("should pass department ID and name to the service", async () => {
            req.params = {
                id: "5"
            };

            req.body = {
                deptName: "Electronics"
            };

            updateDepartmentService.mockResolvedValue({
                deptId: 5,
                deptName: "electronics"
            });

            await updateDepartment(req, res);

            expect(updateDepartmentService).toHaveBeenCalledTimes(1);

            expect(updateDepartmentService).toHaveBeenCalledWith(
                "5",
                "Electronics"
            );
        });

        it("should return 404 when department is not found", async () => {
            req.params = {
                id: "99"
            };

            req.body = {
                deptName: "Unknown"
            };

            const error = new Error("Department not found");
            error.statusCode = 404;

            updateDepartmentService.mockRejectedValue(error);

            await updateDepartment(req, res);

            expect(res.status).toHaveBeenCalledWith(404);

            expect(res.json).toHaveBeenCalledWith({
                message: "Department not found"
            });
        });

        it("should return service error when update fails", async () => {
            req.params = {
                id: "1"
            };

            req.body = {
                deptName: "Computer Science"
            };

            const error = new Error("Database error");
            error.statusCode = 500;

            updateDepartmentService.mockRejectedValue(error);

            await updateDepartment(req, res);

            expect(res.status).toHaveBeenCalledWith(500);

            expect(res.json).toHaveBeenCalledWith({
                message: "Database error"
            });
        });
    });

    // =========================================================
    // DELETE /departments/:id
    // =========================================================

    describe("deleteDepartment", () => {

        it("should delete a department successfully", async () => {
            req.params = {
                id: "1"
            };

            deleteDepartmentService.mockResolvedValue();

            await deleteDepartment(req, res);

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                message: "Department deleted successfully"
            });
        });

        it("should pass department ID to the service", async () => {
            req.params = {
                id: "7"
            };

            deleteDepartmentService.mockResolvedValue();

            await deleteDepartment(req, res);

            expect(deleteDepartmentService).toHaveBeenCalledTimes(1);

            expect(deleteDepartmentService).toHaveBeenCalledWith("7");
        });

        it("should return 404 when department does not exist", async () => {
            req.params = {
                id: "99"
            };

            const error = new Error("Department not found");
            error.statusCode = 404;

            deleteDepartmentService.mockRejectedValue(error);

            await deleteDepartment(req, res);

            expect(res.status).toHaveBeenCalledWith(404);

            expect(res.json).toHaveBeenCalledWith({
                message: "Department not found"
            });
        });

        it("should return service error when deletion fails", async () => {
            req.params = {
                id: "1"
            };

            const error = new Error("Database error");
            error.statusCode = 500;

            deleteDepartmentService.mockRejectedValue(error);

            await deleteDepartment(req, res);

            expect(res.status).toHaveBeenCalledWith(500);

            expect(res.json).toHaveBeenCalledWith({
                message: "Database error"
            });
        });
    });
});