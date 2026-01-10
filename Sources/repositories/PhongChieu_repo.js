import { pool } from '../config/Database/db.js'
import { logger } from '../config/logger.js'

export const phongChieu_Repo = {
  getAll_Repo: async () => {
    try {
      const db = await pool
      const [rows] = await db.query('SELECT * FROM PHONGCHIEU ORDER BY MaPhong ASC')
      logger.info('Lấy tất cả phòng chiếu')
      return rows
    } catch (error) {
      logger.error('Lỗi lấy tất cả phòng chiếu', error)
      throw error
    }
  },

  getById_Repo: async (MaPhong) => {
    try {
      const db = await pool
      const [rows] = await db.query('SELECT * FROM PHONGCHIEU WHERE MaPhong = ?', [MaPhong])
      logger.info(`Lấy phòng chiếu với MaPhong: ${MaPhong}`)
      return rows[0] || null
    } catch (error) {
      logger.error(`Lỗi lấy phòng chiếu với MaPhong: ${MaPhong}`, error)
      throw error
    }
  },

  create_Repo: async (data) => {
    try {
      const db = await pool
      const [result] = await db.query('INSERT INTO PHONGCHIEU SET ?', data)
      logger.info(`Tạo phòng chiếu mới với MaPhong: ${result.insertId}`)
      return result.insertId
    } catch (error) {
      logger.error('Lỗi tạo phòng chiếu mới', error)
      throw error
    }
  },

  update_Repo: async (MaPhong, data) => {
    try {
      const db = await pool
      const [result] = await db.query('UPDATE PHONGCHIEU SET ? WHERE MaPhong = ?', [data, MaPhong])
      logger.info(`Cập nhật phòng chiếu với MaPhong: ${MaPhong}`)
      return result.affectedRows
    } catch (error) {
      logger.error(`Lỗi cập nhật phòng chiếu với MaPhong: ${MaPhong}`, error)
      throw error
    }
  },

  delete_Repo: async (MaPhong) => {
    try {
      const db = await pool
      // Kiểm tra xem phòng có lịch chiếu nào không
      const [lichCheck] = await db.query(
        'SELECT COUNT(*) AS total FROM LICHCHIEU WHERE MaPhong = ?',
        [MaPhong]
      )
      if (lichCheck[0].total > 0) {
        throw new Error('Không thể xóa phòng chiếu đã có lịch chiếu')
      }

      const [result] = await db.query('DELETE FROM PHONGCHIEU WHERE MaPhong = ?', [MaPhong])
      logger.info(`Xóa phòng chiếu với MaPhong: ${MaPhong}`)
      return result.affectedRows
    } catch (error) {
      logger.error(`Lỗi xóa phòng chiếu với MaPhong: ${MaPhong}`, error)
      throw error
    }
  },
}
