import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";

import app from "../../../src/app.js";
import User from "../../../src/models/User.js";
import Department from "../../../src/models/Department.js";

describe("POST /auth/register - Integration", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Department.deleteMany({});

    await Department.create({
      deptId: 101,
      deptName: "Computer Engineering",
    });
  });

  it("registers a STUDENT and persists the user in TestDB", async () => {
    const userData = {
      name: "Bhaumik Modi",
      email: "bhaumik.integration@example.com",
      password: "Strong@123",
      role: "STUDENT",
      sem: 5,
      mobile: "9876543210",
      deptId: 101,
    };

    const response = await request(app)
      .post("/auth/register")
      .send(userData);

    expect(response.status).toBe(201);

    expect(response.body.success).toBe(true);

    expect(response.body.message).toBe(
      "User registered successfully",
    );

    expect(response.body.data).toBeDefined();

    expect(response.body.data.name).toBe("Bhaumik Modi");

    expect(response.body.data.email).toBe(
      "bhaumik.integration@example.com",
    );

    expect(response.body.data.role).toBe("STUDENT");

    expect(response.body.data.sem).toBe(5);

    expect(response.body.data.mobile).toBe("9876543210");

    expect(response.body.data.deptId).toBe(101);

    expect(response.body.data.userId).toMatch(/^STU\d{3}$/);

    expect(response.body.data.password).toBeUndefined();

    const savedUser = await User.findOne({
      email: "bhaumik.integration@example.com",
    }).lean();

    expect(savedUser).not.toBeNull();

    expect(savedUser.name).toBe("Bhaumik Modi");

    expect(savedUser.role).toBe("STUDENT");

    expect(savedUser.sem).toBe(5);

    expect(savedUser.deptId).toBe(101);

    expect(savedUser.userId).toMatch(/^STU\d{3}$/);

    expect(savedUser.password).toBeDefined();

    expect(savedUser.password).not.toBe(userData.password);

    const passwordMatches = await bcrypt.compare(
      userData.password,
      savedUser.password,
    );

    expect(passwordMatches).toBe(true);
  });
});