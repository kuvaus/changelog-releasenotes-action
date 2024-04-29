// eslint.config.js
/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
    {
        files: ["**/*.js", "**/*.cjs"],
        languageOptions: {
            ecmaVersion: 2018,
            sourceType: "commonjs",
            globals: {
                Atomics: "readonly",
                SharedArrayBuffer: "readonly"
            },
        },
        rules: {},
    }
];

