import { payment_Repo } from '../repositories/Payment_repo.js'
import { ve_Repo } from '../repositories/Ve_repo.js'
import { giaoDichTmp_Repo } from '../repositories/GiaoDichTmp_repo.js'
import { logger } from '../config/logger.js'
import { ApiError } from '../utils/ApiError.js'
import { vnpayConfig } from '../config/vnpay.config.js'

export const payment_Services = {

  // ⭐ Tạo URL thanh toán VNPay + lưu ghế PENDING
  createPaymentUrl_Service: async (paymentInfo) => {
    try {
      const { MaKH, MaLich, SoTien, seatData, ipAddr } = paymentInfo

      if (!MaKH || !MaLich || !SoTien || !seatData || seatData.length === 0) {
        throw new ApiError('Thiếu dữ liệu đặt vé', 400)
      }

      const orderId = vnpayConfig.generateOrderId()
      const amount = vnpayConfig.formatCurrency(SoTien)

      // 👉 1. Lưu GHẾ TẠM GIỮ
      // 👉 1. Lưu GHẾ TẠM GIỮ
      for (const seat of seatData) {
        await giaoDichTmp_Repo.createHold_Repo({
          MaGD: orderId,
          MaKH,
          MaLich,
          GheNgoi: seat.GheNgoi
        })
      }


      // 👉 2. Lưu Transaction trạng thái PENDING
      await payment_Repo.createPayment_Repo({
        MaKH,
        MaLich,
        SoTien,
        MaGD: orderId,
      })

      // 👉 3. Build URL VNPay
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

      const paymentUrl = vnpayConfig.buildPaymentUrl(
        paymentData,
        process.env.VNPAY_SECRET_KEY,
        process.env.VNPAY_URL
      )

      logger.info(`Tạo URL thanh toán VNPay cho ${orderId}`)
      return { paymentUrl, orderId }
    } catch (error) {
      logger.error('Lỗi tạo URL thanh toán', error)
      throw error
    }
  },

  // ⭐ Callback – tạo vé khi thanh toán thành công
  handlePaymentCallback_Service: async (vnpParams) => {
    try {
      const { vnp_TxnRef, vnp_ResponseCode, vnp_SecureHash } = vnpParams

      const secureHashParams = { ...vnpParams }
      delete secureHashParams.vnp_SecureHash
      delete secureHashParams.vnp_SecureHashType

      const isValid = vnpayConfig.verifySecureHash(
        secureHashParams,
        process.env.VNPAY_SECRET_KEY,
        vnp_SecureHash
      )
      if (!isValid) throw new ApiError('Chữ ký không hợp lệ', 400)

      const status = vnp_ResponseCode === '00' ? 'SUCCESS' : 'FAILED'
      await payment_Repo.updatePaymentStatus_Repo(vnp_TxnRef, status, vnp_ResponseCode)

      // 🟢 Thanh toán thành công
      if (vnp_ResponseCode === '00') {
        const payment = await payment_Repo.getPaymentByMaGD_Repo(vnp_TxnRef)
        const tmpSeats = await giaoDichTmp_Repo.getByMaGD_Repo(vnp_TxnRef)

        if (payment && tmpSeats && tmpSeats.length > 0) {
          // tạo vé theo từng ghế
          const tickets = tmpSeats.map(tmp => ({
            MaKH: payment.MaKH,
            MaLich: payment.MaLich,
            GheNgoi: tmp.GheNgoi,
            TongTien: payment.SoTien / tmpSeats.length,
            TrangThai: 'ACTIVE'
          }))

          await ve_Repo.createMultiple_Repo(tickets)

          // xóa record ghế tạm
          await giaoDichTmp_Repo.deleteByMaGD_Repo(vnp_TxnRef)

          logger.info(`Tạo ${tickets.length} vé cho ${vnp_TxnRef}`)
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

  getPaymentHistory_Service: async (MaKH) => {
    try {
      const payments = await payment_Repo.getAllPayments_Repo(MaKH)
      return payments
    } catch (error) {
      logger.error(`Lỗi lấy lịch sử thanh toán`, error)
      throw error
    }
  },
}
