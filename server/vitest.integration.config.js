import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",

    setupFiles: ["./tests/integration/setup.js"],

    include: ["tests/integration/**/*.test.js"],

    clearMocks: true,
    restoreMocks: true,

    fileParallelism: false,
    maxWorkers: 1,
  },
});