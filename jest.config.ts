import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    coverageDirectory: "./coverage",
    coverageReporters: ["json", "lcov", "text", "clover"],
    collectCoverageFrom: ["src/**/*.ts"],
    testMatch: ["**/tests/**/*.test.ts"],
    setupFiles: ["./jest.setup.ts"],
};

export default config;
