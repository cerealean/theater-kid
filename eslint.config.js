// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const prettier = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      prettierConfig,
    ],
    plugins: {
      prettier,
    },
    processor: angular.processInlineTemplates,
    rules: {
      // Prettier integration
      "prettier/prettier": "error",

      // Angular-specific rules aligned with Prettier settings
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "tk",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "tk",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      // Angular template rules
      "@angular-eslint/template/no-negated-async": "error",
      "@angular-eslint/template/banana-in-box": "error",
      "@angular-eslint/template/accessibility-elements-content": "error",
      "@angular-eslint/template/accessibility-label-has-associated-control": "error",
      "@angular-eslint/template/accessibility-labels": "error",
      "@angular-eslint/template/click-events-have-key-events": "error",
      "@angular-eslint/template/mouse-events-have-key-events": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "args": "all",
          "argsIgnorePattern": "^_",
          "caughtErrors": "all",
          "caughtErrorsIgnorePattern": "^_",
          "destructuredArrayIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "ignoreRestSiblings": true
        }
      ]
    },
  }
);
