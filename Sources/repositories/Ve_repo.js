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

  // ❌ Tắt hàm này để tránh dùng sai
  create_Repo: async () => {
    throw new Error('❌ Không dùng create_Repo nữa — hãy dùng createMultiple_Repo')
  },

  createMultiple_Repo: async (tickets) => {
    const db = await pool
    const connection = await db.getConnection()

    try {
      await connection.beginTransaction()

      const insertIds = []

      for (const ticket of tickets) {
        const { MaKH, MaLich, GheNgoi, TongTien } = ticket

        // 1️⃣ Check ghế đã được bán
        const [existsInVE] = await connection.query(
          'SELECT MaVe FROM VE WHERE MaLich = ? AND GheNgoi = ?',
          [MaLich, GheNgoi]
        )
        if (existsInVE.length > 0) {
          throw new Error(`Ghế ${GheNgoi} đã được bán`)
        }

        // 2️⃣ Check ghế đang giữ chưa hết hạn
        const [existsInTMP] = await connection.query(
          `
          SELECT MaGiaoDichTmp 
          FROM GIAODICH_TMP 
          WHERE MaLich = ? 
            AND GheNgoi = ?
            AND TrangThai = 'PENDING'
            AND HetHan > NOW()
          `,
          [MaLich, GheNgoi]
        )
        if (existsInTMP.length > 0) {
          throw new Error(`Ghế ${GheNgoi} đang tạm giữ (chưa thanh toán)`)
        }

        // 3️⃣ Insert vé
        const [result] = await connection.query(
          'INSERT INTO VE SET ?',
          {
            MaKH,
            MaLich,
            GheNgoi,
            TongTien,  // Giữ nguyên tiền từ service
            TrangThai: 'ACTIVE',
            NgayMua: new Date(),
          }
        )

        insertIds.push(result.insertId)
      }

      await connection.commit()
      logger.info(`Tạo ${insertIds.length} vé thành công`)
      return insertIds

    } catch (error) {
      await connection.rollback()
      logger.error('Rollback tạo nhiều vé', error)
      throw error
    } finally {
      connection.release()
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
