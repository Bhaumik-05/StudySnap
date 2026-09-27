import { describe, it, expect } from "vitest";
import mongoose from "mongoose";

describe("Integration Test Database", () => {
  it("connects to the dedicated TestDB database", () => {
    expect(mongoose.connection.readyState).toBe(1);

    expect(mongoose.connection.name).toBe("TestDB");
  });
});