module.exports = {
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**',
    ],
    coverageDirectory: "coverage",
    coveragePathIgnorePatterns: [
        "\\\\node_modules\\\\",
    ],
    coverageReporters: [
        "clover",
    ],
    moduleFileExtensions: [
        "js",
        "ts",
    ],
    testEnvironment: "node",
    transform: {
        "^.+\\.(ts|tsx)?$": "ts-jest",
    },
};
