import { pool } from '../config/Database/db.js'
import { logger } from '../config/logger.js'

export const payment_Repo = {
  // Lưu giao dịch VNPay vào DB
  createPayment_Repo: async (paymentData) => {
    try {
      const db = await pool
      const [result] = await db.query(
        `INSERT INTO THANHTOAN (MaKH, MaLich, SoTien, TrangThai, MaGD, NgayTao) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          paymentData.MaKH,
          paymentData.MaLich,
          paymentData.SoTien,
          'PENDING', // Trạng thái chờ thanh toán
          paymentData.MaGD, // Mã giao dịch VNPay
          new Date(),
        ]
      )
      logger.info(`Tạo giao dịch thanh toán mới với MaGD: ${paymentData.MaGD}`)
      return result.insertId
    } catch (error) {
      logger.error('Lỗi tạo giao dịch thanh toán', error)
      throw error
    }
  },

  // Cập nhật trạng thái thanh toán
  updatePaymentStatus_Repo: async (MaGD, status, responseCode) => {
    try {
      const db = await pool
      const [result] = await db.query(
        `UPDATE THANHTOAN SET TrangThai = ?, ResponseCode = ?, NgayCapNhat = ? WHERE MaGD = ?`,
        [status, responseCode, new Date(), MaGD]
      )
      logger.info(`Cập nhật trạng thái giao dịch ${MaGD}: ${status}`)
      return result.affectedRows
    } catch (error) {
      logger.error(`Lỗi cập nhật giao dịch ${MaGD}`, error)
      throw error
    }
  },

  // Lấy giao dịch theo MaGD
  getPaymentByMaGD_Repo: async (MaGD) => {
    try {
      const db = await pool
      const [rows] = await db.query(
        `SELECT * FROM THANHTOAN WHERE MaGD = ?`,
        [MaGD]
      )
      logger.info(`Lấy giao dịch với MaGD: ${MaGD}`)
      return rows[0] || null
    } catch (error) {
      logger.error(`Lỗi lấy giao dịch ${MaGD}`, error)
      throw error
    }
  },

  // Lấy tất cả giao dịch của khách hàng
  getAllPayments_Repo: async (MaKH) => {
    try {
      const db = await pool
      const [rows] = await db.query(
        `SELECT * FROM THANHTOAN WHERE MaKH = ? ORDER BY NgayTao DESC`,
        [MaKH]
      )
      logger.info(`Lấy tất cả giao dịch của khách hàng ${MaKH}`)
      return rows
    } catch (error) {
      logger.error(`Lỗi lấy giao dịch của khách hàng ${MaKH}`, error)
      throw error
    }
  },
}