import { pool } from '../config/Database/db.js'
import { logger } from '../config/logger.js'

export const giaoDichTmp_Repo = {

  /** 🟡 Tạo giữ ghế tạm thời (khi user click Đặt Vé Ngay) */
  createHold_Repo: async ({ MaKH, MaLich, GheNgoi, MaGD }) => {
    try {
      const db = await pool
      const HetHan= new Date(Date.now() + 5 * 60000)

      const [result] = await db.query(
        `
        INSERT INTO GIAODICH_TMP 
        (MaKH, MaLich, GheNgoi, TrangThai, NgayTao, HetHan, MaGD) 
        VALUES (?, ?, ?, 'PENDING', NOW(), ?, ?)
        `,
        [MaKH, MaLich, GheNgoi, HetHan, MaGD || null]
      )

      logger.info(`Giữ ghế tạm: KH ${MaKH} - Lịch ${MaLich} - Ghế ${GheNgoi}`)
      return result.insertId
    } catch (error) {
      logger.error('Lỗi tạo giao dịch tạm', error)
      throw error
    }
  },

  /** 🟢 Đánh dấu COMPLETED khi thanh toán thành công */
  markCompletedByOrderId_Repo: async (MaGD) => {
    try {
      const db = await pool
      await db.query(
        `
        UPDATE GIAODICH_TMP 
        SET TrangThai = 'COMPLETED'
        WHERE MaGD = ?
        `,
        [MaGD]
      )

      logger.info(`Cập nhật giao dịch tạm COMPLETE cho MaGD = ${MaGD}`)
      return true
    } catch (error) {
      logger.error('Lỗi cập nhật COMPLETE giao dịch tạm', error)
      throw error
    }
  },

  /** 🔴 Đánh dấu CANCELLED khi thanh toán thất bại** */
  cancelByOrderId_Repo: async (MaGD) => {
    try {
      const db = await pool
      await db.query(
        `
        UPDATE GIAODICH_TMP
        SET TrangThai = 'CANCELLED'
        WHERE MaGD = ? AND TrangThai = 'PENDING'
        `,
        [MaGD]
      )

      logger.info(`Cập nhật giao dịch tạm CANCELLED cho MaGD = ${MaGD}`)
      return true
    } catch (error) {
      logger.error('Lỗi cập nhật CANCELLED giao dịch tạm', error)
      throw error
    }
  },

  /** ⏳ Xóa/hủy ghế hết hạn */
  removeExpired_Repo: async () => {
    try {
      const db = await pool
      const [result] = await db.query(
        `
         DELETE FROM GIAODICH_TMP
         WHERE TrangThai = 'PENDING'
         AND HetHan < DATE_ADD(UTC_TIMESTAMP(), INTERVAL 7 HOUR);
        `
      )

      if (result.affectedRows > 0) {
        logger.info(`Đã hủy ${result.affectedRows} ghế tạm đã hết hạn`)
      }
      return result.affectedRows
    } catch (error) {
      logger.error('Lỗi hủy giao dịch tạm hết hạn', error)
      throw error
    }
  },

  /** ❓ Check ghế đang tạm giữ hay đã giữ */
  checkSeatHold_Repo: async (MaLich, GheNgoi) => {
    try {
      const db = await pool
      const [rows] = await db.query(
        `
        SELECT * FROM GIAODICH_TMP
        WHERE MaLich = ?
          AND GheNgoi = ?
          AND TrangThai = 'PENDING'
          AND HetHan > NOW()
        `,
        [MaLich, GheNgoi]
      )
      return rows.length > 0
    } catch (error) {
      logger.error('Lỗi kiểm tra ghế tạm giữ', error)
      throw error
    }
  },
  getPendingSeats_Repo: async (MaLich) => {
    const db = await pool;
    const [rows] = await db.query(
      `
        SELECT GheNgoi FROM GIAODICH_TMP
        WHERE MaLich = ?
        AND TrangThai = 'PENDING'
        AND HetHan > NOW()
      `,
      [MaLich]
    )
    return rows.map(r => r.GheNgoi)
  },
  getPendingDetailedByUser_Repo: async (MaKH) => {
    const db = await pool
    const [rows] = await db.query(
      `
      SELECT 
        tmp.GheNgoi,
        tmp.HetHan,
        tmp.MaGD,
        lc.GioChieu,
        p.TenPhong,
        phim.TenPhim,
        phim.Anh
      FROM GIAODICH_TMP tmp
      JOIN LICHCHIEU lc ON tmp.MaLich = lc.MaLich
      JOIN PHONGCHIEU p ON lc.MaPhong = p.MaPhong
      JOIN PHIM phim ON lc.MaPhim = phim.MaPhim
      WHERE tmp.MaKH = ?
        AND tmp.TrangThai = 'PENDING'
        AND tmp.HetHan > NOW()
      ORDER BY tmp.NgayTao DESC
      `,
      [MaKH]
    )
    return rows
  },
  getByMaGD_Repo: async (MaGD) => {
    const db = await pool
    const [rows] = await db.query(
      `
      SELECT *
      FROM GIAODICH_TMP
      WHERE MaGD = ?
        AND TrangThai = 'PENDING'
        AND HetHan > NOW()
      `,
      [MaGD]
    )
    return rows
  },
  getServicesByMaGD_Repo: async (MaGD) => {
    const db = await pool;
    const [rows] = await db.query(
      `SELECT MaDV, SoLuong, Gia FROM GIAODICH_TMP_DV 
       WHERE MaGD = ? AND TrangThai = 'PENDING'`,
      [MaGD]
    );
    return rows;
  },
  
  deleteServicesByMaGD_Repo: async (MaGD) => {
    const db = await pool;
    await db.query(`DELETE FROM GIAODICH_TMP_DV WHERE MaGD = ?`, [MaGD]);
    return true;
  },
  
  
  
}
