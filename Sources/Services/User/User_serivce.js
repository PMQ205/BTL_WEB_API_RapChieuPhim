import { user_Repo } from "../../repositories/User_repo.js";
import { UserDTO } from "../../dtos/User/user.dto.js";
import { logger } from "../../config/logger.js";

export const user_Services = {
    getAllUsers_Service: async () => {
        try {
            const users = await user_Repo.getAllUsers_Repo();
            logger.info("Dịch vụ: Lấy tất cả khách hàng");
            return users.map(user => new UserDTO(user));
        } catch (error) {
            logger.error("Dịch vụ: Lỗi lấy tất cả khách hàng", error);
            throw error;
        }
    },

    getUserByID_Service: async (MaKH) => {
        try {
            const rows = await user_Repo.getUserByID_Repo(MaKH);
            logger.info(`Dịch vụ: Lấy khách hàng với MaKH: ${MaKH}`);
            return rows.map(user => new UserDTO(user));
        } catch (error) {
            logger.error(`Dịch vụ: Lỗi lấy khách hàng với MaKH: ${MaKH}`, error);
            throw error;
        }
    },

    addUser_Service: async (userData) => {
        try {
            const insertId = await user_Repo.addUser_Repo(userData);
            logger.info(`Dịch vụ: Thêm khách hàng mới thành công với ID: ${insertId}`);
            return insertId;
        } catch (error) {
            logger.error("Dịch vụ: Lỗi thêm khách hàng mới", error);
            throw error;
        }
    },

    updateUser_Service: async (MaKH, userData) => {
        try {
            const affectedRows = await user_Repo.updateUser_Repo(MaKH, userData);
            logger.info(`Dịch vụ: Cập nhật khách hàng ID: ${MaKH}`);
            return affectedRows;
        } catch (error) {
            logger.error(`Dịch vụ: Lỗi cập nhật khách hàng ID: ${MaKH}`, error);
            throw error;
        }
    },

    deleteUser_Service: async (MaKH) => {
        try {
            const affectedRows = await user_Repo.deleteUser_Repo(MaKH);
            logger.info(`Dịch vụ: Xóa khách hàng ID: ${MaKH}`);
            return affectedRows;
        } catch (error) {
            logger.error(`Dịch vụ: Lỗi xóa khách hàng ID: ${MaKH}`, error);
            throw error;
        }
    }
};