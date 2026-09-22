import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("GET /", () => {

    it("should confirm that StudySnap API is running", async () => {

        const response = await request(app)
            .get("/");

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            message: "StudySnap API is running"
        });
    });

});