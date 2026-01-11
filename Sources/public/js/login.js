/* global , document */
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const userInput = document.getElementById('email');
    const passInput = document.getElementById('password');
    const errorEmail = document.getElementById('emailError');
    const errorPass = document.getElementById('passwordError');

    form.addEventListener('submit', (e) => {
        const user = userInput.value.trim();
        const pass = passInput.value.trim();

        let ok = true;
        errorEmail.textContent = '';
        errorPass.textContent = '';

        if (!user) {
            errorEmail.textContent = 'Tên đăng nhập bắt buộc';
            ok = false;
        }
        if (!pass) {
            errorPass.textContent = 'Mật khẩu bắt buộc';
            ok = false;
        }
        if (!ok) e.preventDefault();
    });

    // toggle button
    const passToggle = document.getElementById('passwordToggle');
    passToggle.onclick = () => {
        passInput.type = passInput.type === 'password' ? 'text' : 'password';
    };
});
