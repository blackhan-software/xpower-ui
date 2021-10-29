/**
 * @type {import('ts-jest/dist/types').InitialOptionsTsJest}
 */
module.exports = {
  preset: 'ts-jest',
  setupFiles: [
    './test/env-vars.ts'
  ],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns : ['\.js$']
};
