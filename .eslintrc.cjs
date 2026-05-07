// module.exports = {
//   env: { node: true, es2021: true },
//   parser: "@typescript-eslint/parser",
//   plugins: ["@typescript-eslint"],
//   extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
//   rules: {
//     "@typescript-eslint/no-explicit-any": "off",
//     "no-console": "off",
//     "@typescript-eslint/explicit-module-boundary-types": "off"
//   },
// };
module.exports = {
  env: { node: true, es2021: true },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "warn", // better
    "no-console": "warn", // better
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unused-vars": "warn"
  }
};