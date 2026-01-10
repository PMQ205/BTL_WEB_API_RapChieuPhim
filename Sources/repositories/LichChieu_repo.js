import { pool } from '../config/Database/db.js'
import { logger } from '../config/logger.js'

export const lichChieu_Repo = {
  getAll_Repo: async () => {
    try {
      const db = await pool
      const [rows] = await db.query(`
        SELECT lc.*, p.TenPhim, p.Anh, pc.TenPhong, pc.SucChua
        FROM LICHCHIEU lc
        INNER JOIN PHIM p ON lc.MaPhim = p.MaPhim
        INNER JOIN PHONGCHIEU pc ON lc.MaPhong = pc.MaPhong
        ORDER BY lc.GioChieu ASC
      `)
      logger.info('Lấy tất cả lịch chiếu')
      return rows
    } catch (error) {
      logger.error('Lỗi lấy tất cả lịch chiếu', error)
      throw error
    }
  },

  getById_Repo: async (MaLich) => {
    try {
      const db = await pool
      const [rows] = await db.query(
        `
        SELECT lc.*, p.TenPhim, p.Anh, p.ThoiLuong, p.DaoDien, p.DienVien, p.Trailer, pc.TenPhong, pc.SucChua
        FROM LICHCHIEU lc
        INNER JOIN PHIM p ON lc.MaPhim = p.MaPhim
        INNER JOIN PHONGCHIEU pc ON lc.MaPhong = pc.MaPhong
        WHERE lc.MaLich = ?
      `,
        [MaLich]
      )
      logger.info(`Lấy lịch chiếu với MaLich: ${MaLich}`)
      return rows[0] || null
    } catch (error) {
      logger.error(`Lỗi lấy lịch chiếu với MaLich: ${MaLich}`, error)
      throw error
    }
  },

  getByFilmId_Repo: async (MaPhim) => {
    try {
      const db = await pool
      const [rows] = await db.query(
        `
        SELECT lc.*, pc.TenPhong, pc.SucChua
        FROM LICHCHIEU lc
        INNER JOIN PHONGCHIEU pc ON lc.MaPhong = pc.MaPhong
        WHERE lc.MaPhim = ? AND lc.GioChieu > NOW()
        ORDER BY lc.GioChieu ASC
      `,
        [MaPhim]
      )
      logger.info(`Lấy lịch chiếu theo MaPhim: ${MaPhim}`)
      return rows
    } catch (error) {
      logger.error(`Lỗi lấy lịch chiếu theo MaPhim: ${MaPhim}`, error)
      throw error
    }
  },

  create_Repo: async (data) => {
    try {
      const db = await pool
      const [result] = await db.query('INSERT INTO LICHCHIEU SET ?', data)
      logger.info(`Tạo lịch chiếu mới với MaLich: ${result.insertId}`)
      return result.insertId
    } catch (error) {
      logger.error('Lỗi tạo lịch chiếu mới', error)
      throw error
    }
  },

  update_Repo: async (MaLich, data) => {
    try {
      const db = await pool
      const [result] = await db.query('UPDATE LICHCHIEU SET ? WHERE MaLich = ?', [data, MaLich])
      logger.info(`Cập nhật lịch chiếu với MaLich: ${MaLich}`)
      return result.affectedRows
    } catch (error) {
      logger.error(`Lỗi cập nhật lịch chiếu với MaLich: ${MaLich}`, error)
      throw error
    }
  },

  delete_Repo: async (MaLich) => {
    try {
      const db = await pool
      // Kiểm tra xem có vé nào đã được đặt cho lịch chiếu này không
      const [veCheck] = await db.query('SELECT COUNT(*) AS total FROM VE WHERE MaLich = ?', [
        MaLich,
      ])
      if (veCheck[0].total > 0) {
        throw new Error('Không thể xóa lịch chiếu đã có vé được đặt')
      }

      const [result] = await db.query('DELETE FROM LICHCHIEU WHERE MaLich = ?', [MaLich])
      logger.info(`Xóa lịch chiếu với MaLich: ${MaLich}`)
      return result.affectedRows
    } catch (error) {
      logger.error(`Lỗi xóa lịch chiếu với MaLich: ${MaLich}`, error)
      throw error
    }
  },

  getBookedSeats_Repo: async (MaLich) => {
    try {
      const db = await pool
      const [rows] = await db.query('SELECT GheNgoi FROM VE WHERE MaLich = ?', [MaLich])
      logger.info(`Lấy ghế đã đặt cho lịch chiếu ${MaLich}`)
      return rows.map((row) => row.GheNgoi)
    } catch (error) {
      logger.error(`Lỗi lấy ghế đã đặt cho lịch chiếu ${MaLich}`, error)
      throw error
    }
  },
}
