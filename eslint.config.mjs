import eslint from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import nPlugin from "eslint-plugin-n";
import importPlugin from 'eslint-plugin-import';
import globals from "globals";

export default [
  eslint.configs.recommended,
  {
    plugins: {
      import: importPlugin,
      n: nPlugin
    },
    rules: {
      "n/no-missing-import": "error",
      "n/no-unsupported-features/es-syntax": "off",

      "block-spacing": ["error", "always"],
      "comma-spacing": ["error", { "before": false, "after": true }],
      "semi": ["error", "always"],
      "space-before-blocks": ["error", "always"],
      "space-in-parens": ["error", "never"],

      "max-len": ["warn", { "code": 160, "ignoreUrls": true, "ignoreStrings": true, "ignoreTemplateLiterals": true }],

      "indent": ["error", 2]
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json"
        }
      }
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
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      // Disable n/no-missing-import for TS files using path aliases
      "n/no-missing-import": "off",
      // Keep Node syntax rules enabled
      "n/no-unsupported-features/es-syntax": ["error", { ignores: ["modules"] }],
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json"
        }
      }
    }
  },
  {
    languageOptions: {
      globals: globals.node
    }
  },
];
