import { pool } from '../config/Database/db.js'
import { logger } from '../config/logger.js'

export const ve_Repo = {
  getAll_Repo: async (MaKH = null) => {
    try {
      const db = await pool
      let query = `
        SELECT v.*, lc.GioChieu, lc.GiaVe, p.TenPhim, p.Anh, pc.TenPhong
        FROM VE v
        INNER JOIN LICHCHIEU lc ON v.MaLich = lc.MaLich
        INNER JOIN PHIM p ON lc.MaPhim = p.MaPhim
        INNER JOIN PHONGCHIEU pc ON lc.MaPhong = pc.MaPhong
      `
      const params = []
      if (MaKH) {
        query += ' WHERE v.MaKH = ?'
        params.push(MaKH)
      }
      query += ' ORDER BY v.NgayMua DESC'

      const [rows] = await db.query(query, params)
      logger.info(`Lấy tất cả vé${MaKH ? ` của khách hàng ${MaKH}` : ''}`)
      return rows
    } catch (error) {
      logger.error('Lỗi lấy tất cả vé', error)
      throw error
    }
  },

  getById_Repo: async (MaVe) => {
    try {
      const db = await pool
      const [rows] = await db.query(
        `
        SELECT v.*, lc.GioChieu, lc.GiaVe, p.TenPhim, p.Anh, p.ThoiLuong, pc.TenPhong, kh.TenKH, kh.Email, kh.SDT
        FROM VE v
        INNER JOIN LICHCHIEU lc ON v.MaLich = lc.MaLich
        INNER JOIN PHIM p ON lc.MaPhim = p.MaPhim
        INNER JOIN PHONGCHIEU pc ON lc.MaPhong = pc.MaPhong
        INNER JOIN KHACHHANG kh ON v.MaKH = kh.MaKH
        WHERE v.MaVe = ?
      `,
        [MaVe]
      )
      logger.info(`Lấy vé với MaVe: ${MaVe}`)
      return rows[0] || null
    } catch (error) {
      logger.error(`Lỗi lấy vé với MaVe: ${MaVe}`, error)
      throw error
    }
  },

  create_Repo: async (data) => {
    try {
      const db = await pool
      // Kiểm tra ghế đã được đặt chưa
      const [existing] = await db.query('SELECT MaVe FROM VE WHERE MaLich = ? AND GheNgoi = ?', [
        data.MaLich,
        data.GheNgoi,
      ])

      if (existing.length > 0) {
        throw new Error('Ghế này đã được đặt')
      }

      const [result] = await db.query('INSERT INTO VE SET ?', {
        ...data,
        NgayMua: new Date(),
      })
      logger.info(`Tạo vé mới với MaVe: ${result.insertId}`)
      return result.insertId
    } catch (error) {
      logger.error('Lỗi tạo vé mới', error)
      throw error
    }
  },

  createMultiple_Repo: async (tickets) => {
    try {
      const db = await pool
      const connection = await db.getConnection()

      try {
        await connection.beginTransaction()

        // Kiểm tra tất cả ghế trước
        for (const ticket of tickets) {
          const [existing] = await connection.query(
            'SELECT MaVe FROM VE WHERE MaLich = ? AND GheNgoi = ?',
            [ticket.MaLich, ticket.GheNgoi]
          )

          if (existing.length > 0) {
            throw new Error(`Ghế ${ticket.GheNgoi} đã được đặt`)
          }
        }

        // Tạo tất cả vé
        const insertIds = []
        for (const ticket of tickets) {
          const [result] = await connection.query('INSERT INTO VE SET ?', {
            ...ticket,
            NgayMua: new Date(),
          })
          insertIds.push(result.insertId)
        }

        await connection.commit()
        logger.info(`Tạo ${insertIds.length} vé mới`)
        return insertIds
      } catch (error) {
        await connection.rollback()
        throw error
      } finally {
        connection.release()
      }
    } catch (error) {
      logger.error('Lỗi tạo nhiều vé', error)
      throw error
    }
  },

  delete_Repo: async (MaVe) => {
    try {
      const db = await pool
      const [result] = await db.query('DELETE FROM VE WHERE MaVe = ?', [MaVe])
      logger.info(`Xóa vé với MaVe: ${MaVe}`)
      return result.affectedRows
    } catch (error) {
      logger.error(`Lỗi xóa vé với MaVe: ${MaVe}`, error)
      throw error
    }
  },
}
