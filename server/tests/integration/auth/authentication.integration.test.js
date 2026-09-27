import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";

import app from "../../../src/app.js";
import User from "../../../src/models/User.js";
import Department from "../../../src/models/Department.js";
import Session from "../../../src/models/Session.js";
import jwt from "jsonwebtoken";
import env from "../../../src/config/env.js";

/*
 * These are INTEGRATION tests.
 *
 * Unlike the unit tests, we intentionally do NOT mock:
 *
 *   route
 *      ↓
 *   controller
 *      ↓
 *   service
 *      ↓
 *   Mongoose
 *      ↓
 *   TestDB
 *
 * The purpose is to verify that these real components work together.
 */

describe("Authentication Integration Flow", () => {
  const department = {
    deptId: 101,
    deptName: "Computer Engineering",
  };

  const user = {
    name: "Integration User",
    email: "integration.auth@example.com",
    password: "Strong@123",
    role: "STUDENT",
    sem: 5,
    mobile: "9876543210",
    deptId: 101,
  };

  beforeEach(async () => {
    /*
     * Each test starts with a clean state.
     *
     * This prevents one authentication test from affecting another.
     */
    await User.deleteMany({});
    await Department.deleteMany({});
    await Session.deleteMany({});

    await Department.create(department);

    /*
     * Register through the actual API.
     *
     * We intentionally use the API instead of User.create()
     * because registration itself is part of the integration flow.
     */
    const response = await request(app)
      .post("/auth/register")
      .send(user);

    expect(response.status).toBe(201);
  });

  // ---------------------------------------------------------
  // 1. LOGIN SUCCESS
  // ---------------------------------------------------------

  it("logs in a registered user and creates an authenticated session", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: user.email,
        password: user.password,
      });

    /*
     * The exact status confirms that the complete login pipeline
     * accepted the credentials.
     */
    expect(response.status).toBe(200);

    expect(response.body.success).toBe(true);

    /*
     * Verify that an access token was generated.
     */
    expect(response.body.data).toBeDefined();
    expect(response.body.data.accessToken).toBeDefined();

    /*
     * Access tokens should be strings.
     */
    expect(typeof response.body.data.accessToken).toBe("string");

    /*
     * A refresh token/session should also exist.
     *
     * We verify the database because this is an integration test.
     */
    const sessions = await Session.find({}).lean();

    expect(sessions.length).toBe(1);

    expect(sessions[0].userId).toBeDefined();
    expect(sessions[0].refreshToken).toBeDefined();
    expect(sessions[0].expiresAt).toBeDefined();
  });

  // ---------------------------------------------------------
  // 2. WRONG PASSWORD
  // ---------------------------------------------------------

  it("rejects login when the password is incorrect", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: user.email,
        password: "Wrong@123",
      });

    /*
     * The authentication service should reject the credentials.
     */
    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);

    /*
     * Failed authentication must not create a session.
     */
    const sessions = await Session.find({}).lean();

    expect(sessions.length).toBe(0);
  });

  // ---------------------------------------------------------
  // 3. UNKNOWN EMAIL
  // ---------------------------------------------------------

  it("rejects login when the email does not exist", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "doesnotexist@example.com",
        password: user.password,
      });

    expect(response.status).toBe(401);

    expect(response.body.success).toBe(false);

    /*
     * No session should be created for an unknown user.
     */
    const sessions = await Session.find({}).lean();

    expect(sessions.length).toBe(0);
  });

  // ---------------------------------------------------------
  // 4. PASSWORD IS ACTUALLY HASHED
  // ---------------------------------------------------------

  it("authenticates against the hashed password stored in TestDB", async () => {
    const savedUser = await User.findOne({
      email: user.email,
    }).lean();

    expect(savedUser).not.toBeNull();

    /*
     * The database must never contain the plaintext password.
     */
    expect(savedUser.password).not.toBe(user.password);

    /*
     * Verify that the stored hash actually matches the original
     * password using bcrypt.
     */
    const matches = await bcrypt.compare(
      user.password,
      savedUser.password,
    );

    expect(matches).toBe(true);
  });

  // ---------------------------------------------------------
// 5. PROTECTED ENDPOINT WITHOUT TOKEN
// ---------------------------------------------------------

it("rejects access to a protected endpoint without an access token", async () => {
  /*
   * GET /users/me is an actual protected StudySnap route.
   *
   * UserRoutes defines this endpoint as:
   *
   * GET /me → authMiddleware → UserController.getProfile
   *
   * Therefore /users/me allows us to test the real authentication
   * middleware rather than accidentally testing a nonexistent route.
   */
  const response = await request(app)
    .get("/users/me");

  /*
   * No Authorization header means authMiddleware should reject
   * the request before the controller executes.
   */
  expect(response.status).toBe(401);

  expect(response.body.success).toBe(false);
});


// ---------------------------------------------------------
// 6. PROTECTED ENDPOINT WITH VALID TOKEN
// ---------------------------------------------------------

it("allows access to a protected endpoint with a valid access token", async () => {
  /*
   * First perform a real login.
   *
   * login route
   *     ↓
   * auth service
   *     ↓
   * JWT generation
   *     ↓
   * session creation
   */
  const loginResponse = await request(app)
    .post("/auth/login")
    .send({
      email: user.email,
      password: user.password,
    });

  expect(loginResponse.status).toBe(200);

  const accessToken = loginResponse.body.data.accessToken;

expect(accessToken).toBeDefined();
expect(typeof accessToken).toBe("string");

const decodedToken = jwt.verify(
  accessToken,
  env.JWT_SECRET,
);

console.log("Integration JWT payload:", decodedToken);

const response = await request(app)
  .get("/users/me")
  .set("Authorization", `Bearer ${accessToken}`);

console.log("Protected endpoint response:", response.body);

expect(response.status).toBe(200);
expect(response.body.success).toBe(true);
expect(response.body.data).toBeDefined();
});
});