// jest.config.ts
export default {
    preset: "ts-jest",
    testEnvironment: "node",
    verbose: true,
    moduleFileExtensions: ["ts", "js", "json", "node"],
    testMatch: ["**/tests/**/*.test.ts"],
    globals: {
        "ts-jest": {
            tsconfig: "./tsconfig.json",
        },
    },
    setupFilesAfterEnv: ["./src/tests/setup.ts"],
};
