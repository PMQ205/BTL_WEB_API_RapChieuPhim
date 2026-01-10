import { pool } from '../config/Database/db.js'
import { logger } from '../config/logger.js'

export const films_Repo = {
  getAllFilms_Repo: async () => {
    try {
      const db = await pool
      const [rows] = await db.query('SELECT * FROM PHIM')
      logger.info('Lấy tất cả films')
      return rows
    } catch (error) {
      logger.error('Lỗi lấy tất cả films', error)
      throw error
    }
  },
  getFilmsByID_Repo: async (MaPhim) => {
    try {
      const db = await pool
      const [rows] = await db.query('SELECT * FROM PHIM WHERE MaPhim = ?', [MaPhim])
      logger.info(`Lấy film với MaPhim: ${MaPhim}`)
      return rows
    } catch (error) {
      logger.error(`Lỗi lấy film với MaPhim: ${MaPhim}`, error)
      throw error
    }
  },
  addFilm_Repo: async (filmData) => {
    try {
      const db = await pool
      const [result] = await db.query('INSERT INTO PHIM SET ?', filmData)
      logger.info(`Thêm film mới với MaPhim: ${result.insertId}`)
      return result.insertId
    } catch (error) {
      logger.error('Lỗi thêm film mới', error)
      throw error
    }
  },
  updateFilm_Repo: async (MaPhim, filmData) => {
    try {
      const db = await pool
      const [result] = await db.query('UPDATE PHIM SET ? WHERE MaPhim = ?', [filmData, MaPhim])
      logger.info(`Cập nhật film với MaPhim: ${MaPhim}`)
      return result.affectedRows
    } catch (error) {
      logger.error(`Lỗi cập nhật film với MaPhim: ${MaPhim}`, error)
      throw error
    }
  },
  deleteFilm_Repo: async (MaPhim) => {
    try {
      const db = await pool
      const [result] = await db.query('DELETE FROM PHIM  WHERE MaPhim = ?', [MaPhim])
      logger.info(`Xóa film với MaPhim: ${MaPhim}`)
      return result.affectedRows
    } catch (error) {
      logger.error(`Lỗi xóa film với MaPhim: ${MaPhim}`, error)
      throw error
    }
  },
  hasLichChieu_Repo: async (MaPhim) => {
    const db = await pool
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM LICHCHIEU WHERE MaPhim = ?', [
      MaPhim,
    ])
    return rows[0].total > 0
  },
  getFilmsByLoai_Repo: async (Loai, limit = null) => {
    try {
      const db = await pool
      let sql = 'SELECT * FROM PHIM WHERE Loai = ? ORDER BY MaPhim DESC';
      if (limit) sql += ` LIMIT ${limit}`;
      const [rows] = await db.query(sql, [Loai])
      logger.info(`Lấy films theo Loai: ${Loai}`)
      return rows
    } catch (error) {
      logger.error(`Lỗi lấy films theo Loai: ${Loai}`, error)
      throw error
    }
  },
  getFeaturedFilms_Repo: async (Loai, limit = 6) => {
    try {
      const db = await pool
      const [rows] = await db.query('SELECT * FROM PHIM WHERE Loai = ? ORDER BY MaPhim DESC LIMIT ?', [Loai, limit])
      logger.info(`Lấy ${limit} featured films theo Loai: ${Loai}`)
      return rows
    } catch (error) {
      logger.error(`Lỗi lấy ${limit} featured films theo Loai: ${Loai}`, error)
      throw error
    }
  },
}
