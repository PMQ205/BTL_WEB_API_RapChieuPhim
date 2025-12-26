// Sources/Controllers/Users_Controller.js
import { logger } from "../config/logger.js";
import { CreateUserDTO } from "../dtos/User/create_User.dto.js";
import { UpdateUserDTO } from "../dtos/User/update_User.dto.js";
import { user_Services } from "../Services/User/User_serivce.js";

export const users_Controller = {
  // GET /users
  getAllUsers_Controller: async (req, res) => {
    try {
      const users = await user_Services.getAllUsers_Service();
      res.status(200).json(users);
    } catch (error) {
      logger.error("Controller: Lỗi lấy tất cả khách hàng", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  },

  // GET /users/:id
  getUserByID_Controller: async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    try {
      const user = await user_Services.getUserByID_Service(id);
      res.status(200).json(user);
    } catch (error) {
      logger.error(`Controller: Lỗi lấy khách hàng với ID: ${id}`, error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  },

  // POST /users
  addUser_Controller: async (req, res) => {
    try {
      const userDTO = CreateUserDTO.fromRequest(req.body);
      const insertId = await user_Services.addUser_Service(userDTO.toObject());
      res.status(201).json({ insertId });
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Dữ liệu không hợp lệ", details: error.errors });
      }
      logger.error("Controller: Lỗi thêm khách hàng mới", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  },

  // PUT /users/:id
  updateUser_Controller: async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    try {
      const userDTO = UpdateUserDTO.fromRequest(req.body);
      const affectedRows = await user_Services.updateUser_Service(
        id,
        userDTO.toUpdateObject()
      );
      res.status(200).json({ affectedRows });
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Dữ liệu không hợp lệ", details: error.errors });
      }
      logger.error(`Controller: Lỗi cập nhật khách hàng với ID: ${id}`, error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  },

  // DELETE /users/:id
  deleteUser_Controller: async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    try {
      const affectedRows = await user_Services.deleteUser_Service(id);
      res.status(200).json({ affectedRows });
    } catch (error) {
      logger.error(`Controller: Lỗi xóa khách hàng với ID: ${id}`, error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  },
};