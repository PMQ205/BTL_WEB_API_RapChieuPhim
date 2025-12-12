import { pool } from "../config/Database/db.js";
import { logger } from "../config/logger.js";

export const films_Repo = {
    getAllFilms_Repo: async () => {
        try {
            const db = await pool;
            const [rows] = await db.query("SELECT * FROM phim");
            logger.info("Lấy tất cả films");
            return rows;
        } catch (error) {
            logger.error("Lỗi lấy tất cả films", error);
            throw error;
        }   
    },
    getFilmsByID_Repo: async (id) => {
        try {
            const db = await pool;
            const [rows] = await db.query("SELECT * FROM phim WHERE id = ?", [id]);
            logger.info(`Lấy film với ID: ${id}`);
            return rows;
        } catch (error) {
            logger.error(`Lỗi lấy film với ID: ${id}`, error);
            throw error;
        }
    },
    addFilm_Repo: async (filmData) => {
        try {
            const db = await pool;
            const [result] = await db.query("INSERT INTO phim SET ?", filmData);
            logger.info(`Thêm film mới với ID: ${result.insertId}`);
            return result.insertId;
        } catch (error) {
            logger.error("Lỗi thêm film mới", error);
            throw error;
        }
    },
    updateFilm_Repo: async (id, filmData) => {
        try {
            const db = await pool;
            const [result] = await db.query("UPDATE phim SET ? WHERE id = ?", [filmData, id]);
            logger.info(`Cập nhật film với ID: ${id}`);
            return result.affectedRows;
        } catch (error) {
            logger.error(`Lỗi cập nhật film với ID: ${id}`, error);
            throw error;
        }   
    },
    deleteFilm_Repo: async (id) => {
        try {
            const db = await pool;
            const [result] = await db.query("DELETE FROM phim WHERE id = ?", [id]);
            logger.info(`Xóa film với ID: ${id}`);
            return result.affectedRows;
        } catch (error) {
            logger.error(`Lỗi xóa film với ID: ${id}`, error);
            throw error;
        }
    },
    
};