import eslint from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import nPlugin from "eslint-plugin-n";
import globals from "globals";

export default [
  eslint.configs.recommended,
  {
    plugins: { n: nPlugin },
    rules: {
      "n/no-missing-import": "error",
      "n/no-unsupported-features/es-syntax": "off" // Node 22 supports ES modules
    }
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json"
      }
    },
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
    }
  },
  {
    languageOptions: {
      globals: globals.node
    }
  },
];
