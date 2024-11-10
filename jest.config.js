/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  verbose: true,
  collectCoverage: true,
  coverageProvider: "v8",
  testTimeout: 30000,
  collectCoverageFrom: ["src/**/*.ts", "!tests/**", "!**/node_modules/**"],
};
