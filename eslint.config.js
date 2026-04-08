import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,

  {
    files: ["**/*.js"],


    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module", // important for non-module browser JS
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // General
      "no-unused-vars": ["warn"],
      "no-console": "off", // useful for debugging in browser

      // Code quality
      "curly": ["error", "all"],

      // Common mistakes
      "prefer-const": "warn",
      "no-undef": "error",
    },
  },

  {
    ignores: [
      "node_modules",
      "vendor",
      "dist",
      "build",
      "js/md5.js"
    ],
  },
];