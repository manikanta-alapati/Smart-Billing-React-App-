module.exports = {
  transform: {
    "\\.[jt]sx?$": "babel-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "jsdom",
  coveragePathIgnorePatterns: ["node_modules/"],
};
