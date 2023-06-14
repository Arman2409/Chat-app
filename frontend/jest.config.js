module.exports = {
  moduleNameMapper: {
    "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/jest/jest-config/fileMock.js",
    "\\.(css|less)$": "<rootDir>/jest/jest-config/fileMock.js"
  },
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    // '.(css|less,scss)$': '<rootDir>/jest-config/style-mock.js',
    '^.+\\.ts?$': 'ts-jest',
     "^.+\\.scss$": 'jest-scss-transform'
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
    "<rootDir>/jest/setupTests.ts"
  ]
}