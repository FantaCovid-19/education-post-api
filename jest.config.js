const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./config.js'],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  testEnvironment: 'node',
  testRegex: './src/tests/.*\\.(test|spec)?\\.(ts|js)$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/src' }),
  roots: ['<rootDir>/src']
};
