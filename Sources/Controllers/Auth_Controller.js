// Sources/Controllers/Auth_Controller.js
import { authService } from "../Services/auth/Auth_services.js";

export const authController = {

  register: async (req, res, next) => {
    try {
      const id = await authService.register(req.body);
      res.status(201).json({ id });
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const token = await authService.login(
        req.body.TenDangNhap,
        req.body.MatKhau
      );
      res.json({ token });
    } catch (err) {
      next(err);
    }
  },
};
