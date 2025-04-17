import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

const eslintConfig = [...compat.extends("next/core-web-vitals", "next/typescript", "prettier")];
export default eslintConfig;
// import { FlatCompat } from "@eslint/eslintrc";

// const compat = new FlatCompat({
//   // import.meta.dirname is available after Node.js v20.11.0
//   baseDirectory: import.meta.dirname,
// });

// const eslintConfig = [
//   ...compat.config({
//     extends: ["next/core-web-vitals", "next/typescript"],
//   }),
// ];

// console.log(eslintConfig);

// export default eslintConfig;
