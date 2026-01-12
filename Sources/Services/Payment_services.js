import { payment_Repo } from '../repositories/Payment_repo.js'
import { ve_Repo } from '../repositories/Ve_repo.js'
import { logger } from '../config/logger.js'
import { ApiError } from '../utils/ApiError.js'
import { vnpayConfig } from '../config/vnpay.config.js'

export const payment_Services = {
  // Tạo URL thanh toán VNPay
  createPaymentUrl_Service: async (paymentInfo) => {
    try {
      const { MaKH, MaLich, SoTien, ipAddr } = paymentInfo

      // Validate dữ liệu
      if (!MaKH || !MaLich || !SoTien) {
        throw new ApiError('Thông tin thanh toán không đầy đủ', 400)
      }

      // Tạo mã giao dịch unique
      const orderId = vnpayConfig.generateOrderId()
      const amount = vnpayConfig.formatCurrency(SoTien) // Chuyển VNĐ thành số nguyên

      // Lưu vào DB với trạng thái PENDING
      await payment_Repo.createPayment_Repo({
        MaKH,
        MaLich,
        SoTien,
        MaGD: orderId,
      })

      // Tạo dữ liệu gửi sang VNPay
      const paymentData = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: process.env.VNPAY_TMN_CODE,
        vnp_Locale: 'vn',
        vnp_CurrCode: 'VND',
        vnp_TxnRef: orderId,
        vnp_OrderInfo: `Thanh toán vé xem phim - Lịch chiếu ${MaLich}`,
        vnp_OrderType: 'other',
        vnp_Amount: amount,
        vnp_ReturnUrl: process.env.VNPAY_RETURN_URL,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: new Date().toISOString().replace(/[-:T.]/g, '').substring(0, 14),
      }

      // Tạo URL thanh toán
      const paymentUrl = vnpayConfig.buildPaymentUrl(
        paymentData,
        process.env.VNPAY_SECRET_KEY,
        process.env.VNPAY_URL
      )

      logger.info(`Tạo URL thanh toán VNPay cho đơn hàng ${orderId}`)
      return { paymentUrl, orderId }
    } catch (error) {
      logger.error('Lỗi tạo URL thanh toán', error)
      throw error
    }
  },

  // Xử lý callback từ VNPay
  handlePaymentCallback_Service: async (vnpParams) => {
    try {
      const { vnp_TxnRef, vnp_ResponseCode, vnp_SecureHash } = vnpParams

      // Verify checksum từ VNPay
      const secureHashParams = { ...vnpParams }
      delete secureHashParams.vnp_SecureHash
      delete secureHashParams.vnp_SecureHashType

      const isValid = vnpayConfig.verifySecureHash(
        secureHashParams,
        process.env.VNPAY_SECRET_KEY,
        vnp_SecureHash
      )

      if (!isValid) {
        throw new ApiError('Chữ ký thanh toán không hợp lệ', 400)
      }

      // Cập nhật trạng thái thanh toán
      const status = vnp_ResponseCode === '00' ? 'SUCCESS' : 'FAILED'
      await payment_Repo.updatePaymentStatus_Repo(vnp_TxnRef, status, vnp_ResponseCode)

      // Nếu thanh toán thành công, tạo vé
      if (vnp_ResponseCode === '00') {
        const payment = await payment_Repo.getPaymentByMaGD_Repo(vnp_TxnRef)
        if (payment) {
          // Tạo vé
          const ticketData = {
            MaKH: payment.MaKH,
            MaLich: payment.MaLich,
            GheNgoi: 'TBD', // Sẽ được cập nhật từ client
            TongTien: payment.SoTien,
          }
          await ve_Repo.create_Repo(ticketData)
          logger.info(`Tạo vé thành công cho giao dịch ${vnp_TxnRef}`)
        }
      }

      return {
        success: vnp_ResponseCode === '00',
        message: vnp_ResponseCode === '00' ? 'Thanh toán thành công' : 'Thanh toán thất bại',
        orderId: vnp_TxnRef,
      }
    } catch (error) {
      logger.error('Lỗi xử lý callback VNPay', error)
      throw error
    }
  },

  // Lấy lịch sử thanh toán của khách hàng
  getPaymentHistory_Service: async (MaKH) => {
    try {
      const payments = await payment_Repo.getAllPayments_Repo(MaKH)
      logger.info(`Lấy lịch sử thanh toán của khách hàng ${MaKH}`)
      return payments
    } catch (error) {
      logger.error(`Lỗi lấy lịch sử thanh toán`, error)
      throw error
    }
  },
}