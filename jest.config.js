module.exports = {
  automock: false,
  resetMocks: true,
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts"],
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests", "<rootDir>/src"],
  moduleFileExtensions: ["ts", "js"],
  testMatch: ["**/tests/**/*.test.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  modulePaths: ["<rootDir>/src/"],
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 40,
      lines: 50,
      statements: 50,
    },
  },
  coverageProvider: "v8",
};
