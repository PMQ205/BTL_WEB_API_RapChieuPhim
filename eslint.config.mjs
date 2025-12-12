import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    // Bỏ qua các thư mục không cần kiểm tra
    ignores: ["node_modules/", "dist/", "build/"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node, // Cho phép dùng các biến toàn cục của Node.js
      },
    },
    plugins: {
      js: pluginJs,
    },
    rules: {
      ...pluginJs.configs.recommended.rules, // Quy tắc mặc định
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
];
