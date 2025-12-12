
Không bắt buộc  Không bắt buộc  Không bắt buộc  Không bắt buộc  Không bắt buộc  Không bắt buộc  Không bắt buộc  Không bắt buộc  x99

### install ESLint và Prettier hỗ trợ code
bước 1 tải ESLint và Prettier
bước 2 Cài package trong project (bắt buộc)

Trong terminal (trong thư mục project) chạy:

👉 Cài ESLint
npm install eslint --save-dev


Khởi tạo cấu hình ESLint:

npx eslint --init


Chọn như sau:
{lưu ý dùng phím mũi tên để chọn}
 What do you want to lint? · javascript

How would you like to use ESLint? → To check syntax & find problems

What type of modules? → JavaScript modules (import/export)

 Which framework does your project use?  None of these

? Does your project use TypeScript? » No 

√ Where does your code run? · browser

√ Would you like to install them now? · Yes

? Which package manager do you want to use? ... npm

Sau đó sẽ sinh ra file:

.eslintrc.js

3) Cài Prettier trong project (bắt buộc)
npm install prettier --save-dev


Tạo file:

📌 .prettierrc

{
  "singleQuote": true,
  "semi": false,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}

🔥 4) Bật format on save (Quan trọng)
cú pháp vào setting ctrl + ','

Vào VS Code → Settings → tìm: 

format on save


Tick ON.

Hoặc thêm vào:

📌 .vscode/settings.json

{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["javascript", "javascriptreact"],
  "eslint.format.enable": true,
  "prettier.useTabs": false
}


🔹 Như vậy khi bạn bấm Ctrl + S → code tự:

thụt dòng

bỏ dấu thừa

thêm dấu ngoặc đúng

sắp xếp import

xóa dòng trắng thừa

sửa lỗi cơ bản

🔥 5) Để ESLint + Prettier không xung đột

Tải thêm plugin:

npm install eslint-config-prettier eslint-plugin-prettier --save-dev


Thêm vào .eslintrc.config.mjs:
###
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
###
### khi sang folder khác thì cần thêm lại eslint
bước 1 
nếu đã có file eslint.cònig.mjs ở folder khác thì coppy sang , ko thì tạo file mới chạy lệnh : npm init @eslint/config
bước 2 chạy terminal : npm install eslint --save-

Nếu bạn dùng plugin nào (ví dụ @eslint/js), cài thêm:

npm install @eslint/js --save-dev

bước 3, VS Code phải mở đúng folder dự án

ESLint chỉ chạy khi folder bạn mở trong VS Code chứa:

package.json

eslint.config.js

node_modules (đã npm install)

Nếu bạn chỉ mở thư mục file con thì ESLint sẽ không hoạt động.

### install Error Lens để báo lỗi ngay tại dòng lỗi thay vì phải xem terminal
