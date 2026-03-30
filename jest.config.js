/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/nodes/**/?(*.)+(test).ts'],
  testPathIgnorePatterns: ['/dist/'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};
