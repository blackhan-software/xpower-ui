module.exports = {
  preset: 'ts-jest',
  setupFiles: [
    './test/env-vars.ts',
    './test/$.extend.ts',
    './test/text-encoder.ts',
  ],
  testPathIgnorePatterns: ['\.js$'],
};
