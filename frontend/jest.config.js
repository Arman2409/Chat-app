module.exports = {
  moduleNameMapper: {
     '^.+\\.(css|less)$': '<rootDir>/config/CSSStub.js'
  },
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    // '.(css|less,scss)$': '<rootDir>/jest-config/style-mock.js',
    '^.+\\.ts?$': 'ts-jest',
     "^.+\\.scss$": 'jest-scss-transform',
  },
  globals: {
    'ts-jest': {
      tsConfig: {
        jsx: "react-jsx"
      }
    }
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  moduleFileExtensions: ['tsx', 'ts', 'js', 'scss', 'json', 'node'],
  collectCoverage: true,
  clearMocks: true,
  coverageDirectory: "coverage",
  setupFilesAfterEnv: [
    "<rootDir>/setupTests.ts"
  ]
}