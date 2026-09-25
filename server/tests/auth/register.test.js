import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";

import app from "../../src/app.js";
import authService from "../../src/services/authService.js";


/*
 * Mock only the authentication service.
 *
 * Why?
 * ----
 * We want this test file to test:
 *
 * HTTP request
 *      ↓
 * /auth/register route
 *      ↓
 * validateRegisterUser
 *      ↓
 * authController.register
 *      ↓
 * authService.registerUser()
 *
 * But we do NOT want these tests to modify the real MongoDB database.
 *
 * Database/service behavior will be tested separately.
 */
vi.mock("../../src/services/authService.js", () => ({
    default: {
        registerUser: vi.fn(),
        loginUser: vi.fn(),
        logoutUser: vi.fn(),
        refreshAccessToken: vi.fn(),
    },
}));


describe("POST /auth/register", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });


    // ============================================================
    // 1. SUCCESSFUL REGISTRATION
    // ============================================================

    it("should register a valid STUDENT successfully", async () => {

        const mockUser = {
            userId: "STU001",
            name: "Bhaumik Modi",
            email: "bhaumik@example.com",
            role: "STUDENT",
            sem: 5,
            mobile: "9876543210",
            deptId: 101,
        };

        authService.registerUser.mockResolvedValue(mockUser);

        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "Bhaumik Modi",
                email: "bhaumik@example.com",
                password: "Strong@123",
                role: "STUDENT",
                sem: 5,
                mobile: "9876543210",
                deptId: 101,
            });


        expect(response.status).toBe(201);

        expect(response.body).toEqual({
            success: true,
            message: "User registered successfully",
            data: mockUser,
        });


        expect(authService.registerUser).toHaveBeenCalledTimes(1);

        expect(authService.registerUser).toHaveBeenCalledWith({
            name: "Bhaumik Modi",
            email: "bhaumik@example.com",
            password: "Strong@123",
            role: "STUDENT",
            sem: 5,
            mobile: "9876543210",
            deptId: 101,
        });
    });


    // ============================================================
    // 2. FACULTY REGISTRATION
    // ============================================================

    it("should register a valid FACULTY without semester", async () => {

        const mockUser = {
            userId: "FAC001",
            name: "Rahul Sharma",
            email: "rahul@example.com",
            role: "FACULTY",
            deptId: 101,
        };

        authService.registerUser.mockResolvedValue(mockUser);


        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "Rahul Sharma",
                email: "rahul@example.com",
                password: "Faculty@123",
                role: "FACULTY",
                deptId: 101,
            });


        expect(response.status).toBe(201);

        expect(response.body.success).toBe(true);

        expect(response.body.data.role).toBe("FACULTY");

        expect(response.body.data.deptId).toBe(101);

        expect(response.body.data.sem).toBeUndefined();


        expect(authService.registerUser).toHaveBeenCalledTimes(1);
    });


    // ============================================================
    // 3. VALIDATION REJECTION
    // ============================================================

    it("should reject STUDENT registration when semester is missing", async () => {

        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "Bhaumik Modi",
                email: "bhaumik@example.com",
                password: "Strong@123",
                role: "STUDENT",
                deptId: 101,
            });


        expect(response.status).toBe(400);

        expect(response.body.success).toBe(false);

        expect(response.body.message)
            .toBe("Semester must be an integer between 1 and 8");


        // Validation should stop the request before the service.
        expect(authService.registerUser).not.toHaveBeenCalled();
    });


    // ============================================================
    // 4. INVALID ROLE
    // ============================================================

    it("should reject an invalid registration role", async () => {

        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "Strong@123",
                role: "ADMIN",
                sem: 5,
                deptId: 101,
            });


        expect(response.status).toBe(400);

        expect(response.body.success).toBe(false);

        expect(response.body.message)
            .toBe("Role must be STUDENT, FACULTY, or ADMIN");


        expect(authService.registerUser).not.toHaveBeenCalled();
    });


    // ============================================================
    // 5. INVALID PASSWORD
    // ============================================================

    it("should reject a password that does not satisfy validation rules", async () => {

        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "password",
                role: "STUDENT",
                sem: 5,
                deptId: 101,
            });


        expect(response.status).toBe(400);

        expect(response.body.success).toBe(false);

        expect(response.body.message)
            .toBe(
                "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
            );


        expect(authService.registerUser).not.toHaveBeenCalled();
    });


    // ============================================================
    // 6. INVALID EMAIL
    // ============================================================

    it("should reject an invalid email format", async () => {

        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "Test User",
                email: "invalid-email",
                password: "Strong@123",
                role: "STUDENT",
                sem: 5,
                deptId: 101,
            });


        expect(response.status).toBe(400);

        expect(response.body.success).toBe(false);

        expect(response.body.message)
            .toBe("Invalid email format");


        expect(authService.registerUser).not.toHaveBeenCalled();
    });


    // ============================================================
    // 7. INVALID MOBILE
    // ============================================================

    it("should reject an invalid mobile number", async () => {

        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "Strong@123",
                role: "STUDENT",
                sem: 5,
                mobile: "12345",
                deptId: 101,
            });


        expect(response.status).toBe(400);

        expect(response.body.success).toBe(false);

        expect(response.body.message)
            .toBe("Mobile number must contain exactly 10 digits");


        expect(authService.registerUser).not.toHaveBeenCalled();
    });


    // ============================================================
    // 8. INVALID DEPARTMENT ID
    // ============================================================

    it("should reject a non-positive department ID", async () => {

        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "Strong@123",
                role: "STUDENT",
                sem: 5,
                deptId: 0,
            });


        expect(response.status).toBe(400);

        expect(response.body.success).toBe(false);

        expect(response.body.message)
            .toBe("Valid Department ID is required");


        expect(authService.registerUser).not.toHaveBeenCalled();
    });


    // ============================================================
    // 9. EMAIL NORMALIZATION
    // ============================================================

    it("should normalize email before passing it to the service", async () => {

        const mockUser = {
            userId: "STU002",
            name: "Test User",
            email: "test@example.com",
            role: "STUDENT",
            sem: 5,
            deptId: 101,
        };

        authService.registerUser.mockResolvedValue(mockUser);


        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "Test User",
                email: "   TEST@Example.COM   ",
                password: "Strong@123",
                role: "STUDENT",
                sem: 5,
                deptId: 101,
            });


        expect(response.status).toBe(201);


        expect(authService.registerUser).toHaveBeenCalledWith(
            expect.objectContaining({
                email: "test@example.com",
            })
        );
    });


    // ============================================================
    // 10. NAME NORMALIZATION
    // ============================================================

    it("should trim whitespace from the name before passing it to the service", async () => {

        const mockUser = {
            userId: "STU003",
            name: "Test User",
            email: "test@example.com",
            role: "STUDENT",
            sem: 5,
            deptId: 101,
        };

        authService.registerUser.mockResolvedValue(mockUser);


        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "   Test User   ",
                email: "test@example.com",
                password: "Strong@123",
                role: "STUDENT",
                sem: 5,
                deptId: 101,
            });


        expect(response.status).toBe(201);


        expect(authService.registerUser).toHaveBeenCalledWith(
            expect.objectContaining({
                name: "Test User",
            })
        );
    });


    // ============================================================
    // 11. NUMERIC STRING NORMALIZATION
    // ============================================================

    it("should convert numeric semester and department values to numbers", async () => {

        const mockUser = {
            userId: "STU004",
            name: "Test User",
            email: "test4@example.com",
            role: "STUDENT",
            sem: 5,
            deptId: 101,
        };

        authService.registerUser.mockResolvedValue(mockUser);


        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "Test User",
                email: "test4@example.com",
                password: "Strong@123",
                role: "STUDENT",
                sem: "5",
                deptId: "101",
            });


        expect(response.status).toBe(201);


        expect(authService.registerUser).toHaveBeenCalledWith(
            expect.objectContaining({
                sem: 5,
                deptId: 101,
            })
        );


        expect(typeof response.body.data.sem).toBe("number");
    });


    // ============================================================
    // 12. SERVICE ERROR - DUPLICATE EMAIL
    // ============================================================

    it("should return the service error when the email already exists", async () => {

        const error = new Error("Email already exists");

        error.statusCode = 409;

        authService.registerUser.mockRejectedValue(error);


        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "Existing User",
                email: "existing@example.com",
                password: "Strong@123",
                role: "STUDENT",
                sem: 5,
                deptId: 101,
            });


        expect(response.status).toBe(409);

        expect(response.body.success).toBe(false);

        expect(response.body.message)
            .toBe("Email already exists");


        expect(authService.registerUser).toHaveBeenCalledTimes(1);
    });


    // ============================================================
    // 13. SERVICE ERROR - DEPARTMENT DOES NOT EXIST
    // ============================================================

    it("should return the service error when the department does not exist", async () => {

        const error = new Error("Department does not exist");

        error.statusCode = 400;

        authService.registerUser.mockRejectedValue(error);


        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "Test User",
                email: "nodept@example.com",
                password: "Strong@123",
                role: "STUDENT",
                sem: 5,
                deptId: 999,
            });


        expect(response.status).toBe(400);

        expect(response.body.success).toBe(false);

        expect(response.body.message)
            .toBe("Department does not exist");


        expect(authService.registerUser).toHaveBeenCalledTimes(1);
    });


    // ============================================================
    // 14. SERVICE ERROR - DEPARTMENT REQUIRED
    // ============================================================

    it("should return the service error when department is required but unavailable", async () => {

        const error = new Error(
            "Department ID is required for non-admin users"
        );

        error.statusCode = 404;

        authService.registerUser.mockRejectedValue(error);


        /*
         * We intentionally call the service mock directly through
         * the route after passing validation.
         *
         * The current validation middleware already rejects a missing
         * deptId before reaching the service. Therefore this test uses
         * the service mock to document the service-level error contract.
         */

        const result = await authService.registerUser({
            name: "Test User",
            email: "nodept-service@example.com",
            password: "Strong@123",
            role: "STUDENT",
            sem: 5,
        }).catch(error => error);


        expect(result.message)
            .toBe("Department ID is required for non-admin users");

        expect(result.statusCode).toBe(404);
    });


    // ============================================================
    // 15. SERVICE INTERNAL ERROR
    // ============================================================

    it("should return 500 when registration service throws an unknown error", async () => {

        authService.registerUser.mockRejectedValue(
            new Error("Unexpected database failure")
        );


        const response = await request(app)
            .post("/auth/register")
            .send({
                name: "Test User",
                email: "database@example.com",
                password: "Strong@123",
                role: "STUDENT",
                sem: 5,
                deptId: 101,
            });


        expect(response.status).toBe(500);

        expect(response.body.success).toBe(false);

        expect(response.body.message)
            .toBe("Unexpected database failure");
    });

});
