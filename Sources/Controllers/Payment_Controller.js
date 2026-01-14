import { payment_Services } from '../Services/Payment_services.js'
import { logger } from '../config/logger.js'

export const payment_Controller = {
  // API: Tạo URL thanh toán
  createPaymentUrl: async (req, res) => {
    try {
      const { MaLich, SoTien, seatData } = req.body
      const MaKH = req.user?.MaKH || req.user?.id

      if (!MaKH) {
        return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập' })
      }

      // Lấy IP của client
      const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress

      const result = await payment_Services.createPaymentUrl_Service({
        MaKH,
        MaLich,
        SoTien,
        seatData,
        ipAddr,
      })      

      logger.info(`Tạo URL thanh toán cho khách hàng ${MaKH}, đơn hàng ${result.orderId}`)
      return res.status(200).json({
        success: true,
        paymentUrl: result.paymentUrl,
        orderId: result.orderId,
      })
    } catch (error) {
      logger.error('Controller: Lỗi tạo URL thanh toán', error)
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Lỗi tạo URL thanh toán',
      })
    }
  },

  // DEMO: Giữ ghế + tạo giao dịch tạm (không gọi VNPay)
  demoHold: async (req, res) => {
    try {
      const { MaLich, SoTien, seatData } = req.body
      const MaKH = req.user?.MaKH || req.user?.id

      if (!MaKH) {
        return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập' })
      }

      const result = await payment_Services.demoHold_Service({
        MaKH,
        MaLich,
        SoTien,
        seatData,
      })

      return res.status(200).json({ success: true, orderId: result.orderId })
    } catch (error) {
      logger.error('DEMO: Lỗi hold giao dịch', error)
      return res.status(500).json({ success: false, message: error.message || 'Lỗi giữ ghế' })
    }
  },

  // DEMO: Hoàn tất thanh toán, tạo vé
  demoComplete: async (req, res) => {
    try {
      const { orderId } = req.body
      if (!orderId) {
        return res.status(400).json({ success: false, message: 'Thiếu orderId' })
      }

      await payment_Services.demoComplete_Service({ MaGD: orderId })
      return res.status(200).json({ success: true })
    } catch (error) {
      logger.error('DEMO: Lỗi complete giao dịch', error)
      return res.status(500).json({ success: false, message: error.message || 'Lỗi hoàn tất thanh toán' })
    }
  },

  // DEMO: Lấy thông tin giao dịch tạm để thanh toán lại
  getPendingInfo: async (req, res) => {
    try {
      const { orderId } = req.params
      const info = await payment_Services.getPendingInfo_Service(orderId)
      return res.status(200).json({ success: true, data: info })
    } catch (error) {
      logger.error('DEMO: Lỗi lấy pending info', error)
      return res.status(500).json({ success: false, message: error.message || 'Không lấy được thông tin vé chờ' })
    }
  },

  // API: Callback từ VNPay (return URL)
  paymentReturn: async (req, res) => {
    try {
      const vnpParams = req.query
      
      // Lấy seatData từ sessionStorage (được gửi qua query param)
      const seatData = req.query.seatData ? JSON.parse(req.query.seatData) : null

      const result = await payment_Services.handlePaymentCallback_Service(vnpParams, seatData)

      if (result.success) {
        logger.info(`Thanh toán thành công: ${result.orderId}`)
        return res.redirect(`/payment-success?orderId=${result.orderId}`)
      } else {
        logger.warn(`Thanh toán thất bại: ${result.orderId}`)
        return res.redirect(`/payment-failed?orderId=${result.orderId}`)
      }
    } catch (error) {
      logger.error('Controller: Lỗi xử lý callback VNPay', error)
      return res.redirect(`/payment-error?message=${encodeURIComponent(error.message)}`)
    }
  },

  // API: Webhook từ VNPay (server-to-server notification)
  paymentNotify: async (req, res) => {
    try {
      const vnpParams = req.query

      const result = await payment_Services.handlePaymentCallback_Service(vnpParams)

      // VNPay yêu cầu trả về JSON response
      return res.status(200).json({
        RspCode: result.success ? '00' : '01',
        Message: result.message,
      })
    } catch (error) {
      logger.error('Controller: Lỗi webhook VNPay', error)
      return res.status(500).json({
        RspCode: '99',
        Message: error.message,
      })
    }
  },

  // API: Lấy lịch sử thanh toán
  getPaymentHistory: async (req, res) => {
    try {
      const MaKH = req.user?.MaKH || req.user?.id

      if (!MaKH) {
        return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập' })
      }

      const payments = await payment_Services.getPaymentHistory_Service(MaKH)

      logger.info(`Lấy lịch sử thanh toán của khách hàng ${MaKH}`)
      return res.status(200).json({
        success: true,
        data: payments,
      })
    } catch (error) {
      logger.error('Controller: Lỗi lấy lịch sử thanh toán', error)
      return res.status(500).json({
        success: false,
        message: error.message || 'Lỗi lấy lịch sử thanh toán',
      })
    }
  },

  // VIEW: Trang thành công
  paymentSuccessPage: async (req, res) => {
    try {
      const orderId = req.query.orderId
      if (!orderId) {
        return res.redirect('/')
      }
      res.render('payment-success', { orderId })
    } catch (error) {
      logger.error('Controller: Lỗi render trang success', error)
      res.redirect('/')
    }
  },

  // VIEW: Trang thất bại
  paymentFailedPage: async (req, res) => {
    try {
      const orderId = req.query.orderId
      res.render('payment-failed', { orderId: orderId || '' })
    } catch (error) {
      logger.error('Controller: Lỗi render trang failed', error)
      res.redirect('/')
    }
  },
}