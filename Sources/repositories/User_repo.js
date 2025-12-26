import { pool } from "../config/Database/db.js";
import { logger } from "../config/logger.js";

export const user_Repo = {
    getAllUsers_Repo: async () => {
        try {
            const db = await pool;
            const [rows] = await db.query("SELECT * FROM KHACHHANG");
            logger.info("Lấy tất cả khách hàng");
            return rows;
        } catch (error) {
            logger.error("Lỗi lấy tất cả khách hàng", error);
            throw error;
        }
    },

    getUserByID_Repo: async (MaKH) => {
        try {
            const db = await pool;
            const [rows] = await db.query("SELECT * FROM KHACHHANG WHERE MaKH = ?", [MaKH]);
            logger.info(`Lấy khách hàng với MaKH: ${MaKH}`);
            return rows;
        } catch (error) {
            logger.error(`Lỗi lấy khách hàng với ID: ${MaKH}`, error);
            throw error;
        }
    },

    addUser_Repo: async (userData) => {
        try {
            const db = await pool;
            const [result] = await db.query("INSERT INTO KHACHHANG SET ?", userData);
            logger.info(`Thêm khách hàng mới với ID: ${result.insertId}`);
            return result.insertId;
        } catch (error) {
            logger.error("Lỗi thêm khách hàng mới", error);
            throw error;
        }
    },

    updateUser_Repo: async (MaKH, userData) => {
        try {
            const db = await pool;
            const [result] = await db.query("UPDATE KHACHHANG SET ? WHERE MaKH = ?", [userData, MaKH]);
            logger.info(`Cập nhật khách hàng với ID: ${MaKH}`);
            return result.affectedRows;
        } catch (error) {
            logger.error(`Lỗi cập nhật khách hàng với ID: ${MaKH}`, error);
            throw error;
        }
    },

    deleteUser_Repo: async (MaKH) => {
        try {
            const db = await pool;
            const [result] = await db.query("DELETE FROM KHACHHANG WHERE MaKH = ?", [MaKH]);
            logger.info(`Xóa khách hàng với ID: ${MaKH}`);
            return result.affectedRows;
        } catch (error) {
            logger.error(`Lỗi xóa khách hàng với ID: ${MaKH}`, error);
            throw error;
        }
    }
};