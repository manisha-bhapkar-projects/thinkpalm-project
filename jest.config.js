const { defaults } = require('jest-config');

module.exports = {
    setupFilesAfterEnv: ['<rootDir>/src/setUpTests.js'],
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx', 'svg'],
    testEnvironment: 'jsdom',
    collectCoverage: true,
    coverageReporters: ["lcov"],
    coverageDirectory: "./code-coverage",
    globals: {
        window: {
            open: () => { }
        }
    },
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "^@root(.*)$": "<rootDir>/src$1",
    },
    transform: {},
    "reporters": [
        "default",
        ["./node_modules/jest-html-reporter", {
            "pageTitle": "Expandopedia Unit Test Report"
        }]
    ]
};