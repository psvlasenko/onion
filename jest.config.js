module.exports = {
    name: "chaika",
    testEnvironment: "node",
    globals: {
        "ts-jest": {
            diagnostics: true
        },
    },
    setupFilesAfterEnv: ['jest-extended', 'chaika-jest-custom-extension'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    testRegex: '((\\.|/)(test.ts|spec.js|spec.ts))$',
    testURL: 'http://localhost/',
    moduleDirectories: [
        'node_modules',
        'src'
    ],
    moduleFileExtensions: [
        'ts',
        'js'
    ],
    testTimeout: 50000,
}
