import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(mp4|jpeg|jpg|png|svg)$": "<rootDir>/src/__mocks__/fileMock.ts",
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};

export default config;