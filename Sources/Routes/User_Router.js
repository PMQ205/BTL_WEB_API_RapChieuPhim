import { Router } from "express";
import { users_Controller } from "../Controllers/Users_Controller.js";

const user_Router = Router();

user_Router.get("/", users_Controller.getAllUsers_Controller);

user_Router.get("/:id", users_Controller.getUserByID_Controller);

user_Router.post("/", users_Controller.addUser_Controller);

user_Router.put("/:id", users_Controller.updateUser_Controller);

user_Router.delete("/:id", users_Controller.deleteUser_Controller);

export default user_Router;