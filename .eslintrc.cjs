module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  plugins: ["svelte3", "@typescript-eslint"],
  ignorePatterns: ["*.cjs", "netlify-cms-app.js"],
  overrides: [{ files: ["*.svelte"], processor: "svelte3/svelte3" }],
  settings: {
    "svelte3/typescript": () => require("typescript"),
    "svelte3/ignore-styles": ({ lang }) => lang === "scss",
  },
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2019,
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
};
