import dotenv from "dotenv";
import mongoose from "mongoose";

import { beforeAll, afterAll } from "vitest";

process.env.STUDYSNAP_TEST = "true";

dotenv.config({
  path: ".env.test",
  override: true,
});

const testMongoUri = process.env.MONGODB_URI;

if (!testMongoUri) {
  throw new Error(
    "Integration tests require MONGODB_URI in .env.test",
  );
}

let databaseName;

try {
  databaseName = new URL(testMongoUri).pathname.replace(/^\/+/, "");
} catch {
  throw new Error(
    "Invalid MONGODB_URI in .env.test",
  );
}

if (databaseName !== "TestDB") {
  throw new Error(
    `Integration tests must use TestDB. Received database: ${databaseName}`,
  );
}

beforeAll(async () => {
  await mongoose.connect(testMongoUri);

  console.log(
    `Integration test database connected: ${mongoose.connection.name}`,
  );
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
  }

  await mongoose.disconnect();
});