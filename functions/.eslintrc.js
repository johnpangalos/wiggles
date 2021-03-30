module.exports = {
  env: {
    es6: true,
    node: true,
  },
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
};
// {
// "root": true,
// "env": {
// "es6": true,
// "node": true
// },
// "extends": [
// "eslint:recommended",
// "plugin:import/errors",
// "plugin:import/warnings",
// "plugin:import/typescript",
// "plugin:@typescript-eslint/recommended"
// ],
// "parser": "@typescript-eslint/parser",
// "parserOptions": {
// "project": ["tsconfig.json", "tsconfig.dev.json"],
// "sourceType": "module"
// },
// "ignorePatterns": ["/lib/**/*"],
// "plugins": ["@typescript-eslint", "import"],
// "rules": {
// "quotes": ["error", "double"]
// }
// }
