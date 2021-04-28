const path = require("path");
module.exports = {
  parser: "@typescript-eslint/parser", // add the TypeScript parser
  plugins: [
    "svelte3",
    "@typescript-eslint", // add the TypeScript plugin
  ],
  overrides: [
    {
      files: ["*.svelte"],
      processor: "svelte3/svelte3",
    },
  ],
  settings: {
    "svelte3/typescript": () => require("typescript"), // pass the TypeScript package to the Svelte plugin
  },
  parserOptions: {
    // add these parser options
    tsconfigRootDir: path.join(__dirname, "web"),
    project: ["./tsconfig.json"],
    extraFileExtensions: [".svelte"],
  },
  extends: [
    // then, enable whichever type-aware rules you want to use
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
};
