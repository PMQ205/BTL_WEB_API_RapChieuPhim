// Sources/Routes/Auth_Router.js
import { Router } from "express";
import { authController } from "../Controllers/Auth_Controller.js";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

export default router;
