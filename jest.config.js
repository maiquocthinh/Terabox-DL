module.exports = {
    testEnvironment: "miniflare",
    transform: {
        "^.+\\.(ts|tsx)$": "esbuild-jest",
    },
    moduleNameMapper: {
        __STATIC_CONTENT_MANIFEST: "<rootDir>/tests/manifest.ts",
    },
}
