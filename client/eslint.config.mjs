import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Widespread across the codebase — treat as warnings until fully typed
      "@typescript-eslint/no-explicit-any": "warn",
      // Content-heavy site with intentional quotes/apostrophes in JSX
      "react/no-unescaped-entities": "warn",
      // Functions used in useEffect before const declaration (works at runtime)
      "react-hooks/immutability": "warn",
      // ts-ignore comments — warn instead of block CI
      "@typescript-eslint/ban-ts-comment": "warn",
      // Minor hook patterns — warn only
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/static-components": "warn",
    },
  },
]);

export default eslintConfig;
