
import { describe, it, expect } from "vitest";

import {
    validateRegisterUser,
    validateLoginUser
} from "../../src/middleware/validation/userValidation.js";


describe("Auth Validation Middleware", () => {

    // ============================================================
    // REGISTER VALIDATION
    // ============================================================

    describe("validateRegisterUser", () => {

        it("should accept a valid STUDENT registration", () => {

            const req = {
                body: {
                    name: "Bhaumik Modi",
                    email: "Bhaumik@Example.com",
                    password: "Strong@123",
                    role: "STUDENT",
                    sem: 5,
                    mobile: "9876543210",
                    deptId: 101
                }
            };

            let nextCalled = false;

            const res = {
                status: () => res,
                json: () => res
            };

            const next = () => {
                nextCalled = true;
            };

            validateRegisterUser(req, res, next);

            expect(nextCalled).toBe(true);

            // Check normalization performed by middleware
            expect(req.body.name).toBe("Bhaumik Modi");
            expect(req.body.email).toBe("bhaumik@example.com");
            expect(req.body.sem).toBe(5);
            expect(req.body.deptId).toBe(101);
            expect(req.body.mobile).toBe("9876543210");
        });


        it("should accept a valid FACULTY registration without semester", () => {

            const req = {
                body: {
                    name: "Rahul Sharma",
                    email: "rahul@example.com",
                    password: "Faculty@123",
                    role: "FACULTY",
                    deptId: 101
                }
            };

            let nextCalled = false;

            const res = {
                status: () => res,
                json: () => res
            };

            const next = () => {
                nextCalled = true;
            };

            validateRegisterUser(req, res, next);

            expect(nextCalled).toBe(true);
        });


        it("should reject STUDENT registration when semester is missing", () => {

            const req = {
                body: {
                    name: "Bhaumik Modi",
                    email: "bhaumik@example.com",
                    password: "Strong@123",
                    role: "STUDENT",
                    deptId: 101
                }
            };

            let statusCode;
            let responseBody;

            const res = {
                status: (code) => {
                    statusCode = code;
                    return res;
                },
                json: (body) => {
                    responseBody = body;
                    return res;
                }
            };

            const next = () => {
                throw new Error("next() should not be called");
            };

            validateRegisterUser(req, res, next);

            expect(statusCode).toBe(400);
            expect(responseBody.success).toBe(false);
            expect(responseBody.message)
                .toBe("Semester must be an integer between 1 and 8");
        });


        it("should reject an invalid role", () => {

            const req = {
                body: {
                    name: "Bhaumik Modi",
                    email: "bhaumik@example.com",
                    password: "Strong@123",
                    role: "ADMIN",
                    sem: 5,
                    deptId: 101
                }
            };

            let statusCode;

            const res = {
                status: (code) => {
                    statusCode = code;
                    return res;
                },
                json: () => res
            };

            const next = () => {
                throw new Error("next() should not be called");
            };

            validateRegisterUser(req, res, next);

            expect(statusCode).toBe(400);
        });


        it("should reject a password that does not satisfy password requirements", () => {

            const req = {
                body: {
                    name: "Bhaumik Modi",
                    email: "bhaumik@example.com",
                    password: "password",
                    role: "STUDENT",
                    sem: 5,
                    deptId: 101
                }
            };

            let statusCode;

            const res = {
                status: (code) => {
                    statusCode = code;
                    return res;
                },
                json: () => res
            };

            validateRegisterUser(req, res, () => {
                throw new Error("next() should not be called");
            });

            expect(statusCode).toBe(400);
        });


        it("should reject an invalid mobile number", () => {

            const req = {
                body: {
                    name: "Bhaumik Modi",
                    email: "bhaumik@example.com",
                    password: "Strong@123",
                    role: "STUDENT",
                    sem: 5,
                    mobile: "12345",
                    deptId: 101
                }
            };

            let statusCode;

            const res = {
                status: (code) => {
                    statusCode = code;
                    return res;
                },
                json: () => res
            };

            validateRegisterUser(req, res, () => {
                throw new Error("next() should not be called");
            });

            expect(statusCode).toBe(400);
        });


        // ------------------------------------------------------------
        // Semester boundary tests
        // ------------------------------------------------------------

        it("should accept semester 1", () => {

            const req = {
                body: {
                    name: "Test User",
                    email: "test1@example.com",
                    password: "Strong@123",
                    role: "STUDENT",
                    sem: 1,
                    deptId: 101
                }
            };

            let nextCalled = false;

            const res = {
                status: () => res,
                json: () => res
            };

            validateRegisterUser(req, res, () => {
                nextCalled = true;
            });

            expect(nextCalled).toBe(true);
        });


        it("should accept semester 8", () => {

            const req = {
                body: {
                    name: "Test User",
                    email: "test8@example.com",
                    password: "Strong@123",
                    role: "STUDENT",
                    sem: 8,
                    deptId: 101
                }
            };

            let nextCalled = false;

            const res = {
                status: () => res,
                json: () => res
            };

            validateRegisterUser(req, res, () => {
                nextCalled = true;
            });

            expect(nextCalled).toBe(true);
        });


        it("should reject semester 0", () => {

            const req = {
                body: {
                    name: "Test User",
                    email: "test0@example.com",
                    password: "Strong@123",
                    role: "STUDENT",
                    sem: 0,
                    deptId: 101
                }
            };

            let statusCode;

            const res = {
                status: (code) => {
                    statusCode = code;
                    return res;
                },
                json: () => res
            };

            validateRegisterUser(req, res, () => {
                throw new Error("next() should not be called");
            });

            expect(statusCode).toBe(400);
        });


        it("should reject semester 9", () => {

            const req = {
                body: {
                    name: "Test User",
                    email: "test9@example.com",
                    password: "Strong@123",
                    role: "STUDENT",
                    sem: 9,
                    deptId: 101
                }
            };

            let statusCode;

            const res = {
                status: (code) => {
                    statusCode = code;
                    return res;
                },
                json: () => res
            };

            validateRegisterUser(req, res, () => {
                throw new Error("next() should not be called");
            });

            expect(statusCode).toBe(400);
        });


        // ------------------------------------------------------------
        // Semester type tests
        // ------------------------------------------------------------

        it("should accept semester provided as a numeric string", () => {

            const req = {
                body: {
                    name: "Test User",
                    email: "test-string-sem@example.com",
                    password: "Strong@123",
                    role: "STUDENT",
                    sem: "5",
                    deptId: 101
                }
            };

            let nextCalled = false;

            const res = {
                status: () => res,
                json: () => res
            };

            validateRegisterUser(req, res, () => {
                nextCalled = true;
            });

            expect(nextCalled).toBe(true);
            expect(req.body.sem).toBe(5);
        });


        it("should reject a decimal semester", () => {

            const req = {
                body: {
                    name: "Test User",
                    email: "test-decimal@example.com",
                    password: "Strong@123",
                    role: "STUDENT",
                    sem: 5.5,
                    deptId: 101
                }
            };

            let statusCode;

            const res = {
                status: (code) => {
                    statusCode = code;
                    return res;
                },
                json: () => res
            };

            validateRegisterUser(req, res, () => {
                throw new Error("next() should not be called");
            });

            expect(statusCode).toBe(400);
        });


        it("should reject a non-numeric semester", () => {

            const req = {
                body: {
                    name: "Test User",
                    email: "test-nonnumeric@example.com",
                    password: "Strong@123",
                    role: "STUDENT",
                    sem: "abc",
                    deptId: 101
                }
            };

            let statusCode;

            const res = {
                status: (code) => {
                    statusCode = code;
                    return res;
                },
                json: () => res
            };

            validateRegisterUser(req, res, () => {
                throw new Error("next() should not be called");
            });

            expect(statusCode).toBe(400);
        });


        // ------------------------------------------------------------
        // Normalization tests
        // ------------------------------------------------------------

        it("should trim whitespace from email", () => {

            const req = {
                body: {
                    name: "Test User",
                    email: "   test@example.com   ",
                    password: "Strong@123",
                    role: "STUDENT",
                    sem: 5,
                    deptId: 101
                }
            };

            let nextCalled = false;

            const res = {
                status: () => res,
                json: () => res
            };

            validateRegisterUser(req, res, () => {
                nextCalled = true;
            });

            expect(nextCalled).toBe(true);
            expect(req.body.email).toBe("test@example.com");
        });


        it("should trim whitespace from name", () => {

            const req = {
                body: {
                    name: "   Bhaumik Modi   ",
                    email: "name@example.com",
                    password: "Strong@123",
                    role: "STUDENT",
                    sem: 5,
                    deptId: 101
                }
            };

            let nextCalled = false;

            const res = {
                status: () => res,
                json: () => res
            };

            validateRegisterUser(req, res, () => {
                nextCalled = true;
            });

            expect(nextCalled).toBe(true);
            expect(req.body.name).toBe("Bhaumik Modi");
        });

    });


    // ============================================================
    // LOGIN VALIDATION
    // ============================================================

    describe("validateLoginUser", () => {

        it("should accept valid login credentials", () => {

            const req = {
                body: {
                    email: "  USER@Example.com ",
                    password: "Anything123"
                }
            };

            let nextCalled = false;

            const res = {
                status: () => res,
                json: () => res
            };

            const next = () => {
                nextCalled = true;
            };

            validateLoginUser(req, res, next);

            expect(nextCalled).toBe(true);

            // Email should be trimmed and converted to lowercase
            expect(req.body.email).toBe("user@example.com");
        });


        it("should reject an invalid email format", () => {

            const req = {
                body: {
                    email: "not-an-email",
                    password: "Anything123"
                }
            };

            let statusCode;

            const res = {
                status: (code) => {
                    statusCode = code;
                    return res;
                },
                json: () => res
            };

            validateLoginUser(req, res, () => {
                throw new Error("next() should not be called");
            });

            expect(statusCode).toBe(400);
        });


        it("should reject a missing password", () => {

            const req = {
                body: {
                    email: "user@example.com"
                }
            };

            let statusCode;

            const res = {
                status: (code) => {
                    statusCode = code;
                    return res;
                },
                json: () => res
            };

            validateLoginUser(req, res, () => {
                throw new Error("next() should not be called");
            });

            expect(statusCode).toBe(400);
        });

    });

});