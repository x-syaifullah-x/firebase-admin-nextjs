import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat
    .config({
      extends: ["next/core-web-vitals", "next/typescript"],
      rules: {
        "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
        "@next/next/no-html-link-for-pages": "off",
        "quotes": ["error", "double"],
        "import/no-unresolved": 0,
        "indent": ["error", 2, {
          "SwitchCase": 1
        }],
        "semi": ["error", "never"],
        "object-curly-spacing": ["error", "always"],
        "max-len": "off",
      },
    }),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
]

export default eslintConfig
