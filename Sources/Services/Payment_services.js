// import { payment_Repo } from '../repositories/Payment_repo.js'
// import { ve_Repo } from '../repositories/Ve_repo.js'
// import { giaoDichTmp_Repo } from '../repositories/GiaoDichTmp_repo.js'
// import { logger } from '../config/logger.js'
// import { ApiError } from '../utils/ApiError.js'
// import { vnpayConfig } from '../config/vnpay.config.js'

// export const payment_Services = {

//   // ⭐ Tạo URL thanh toán VNPay + lưu ghế PENDING
//   createPaymentUrl_Service: async (paymentInfo) => {
//     try {
//       const { MaKH, MaLich, SoTien, seatData, ipAddr } = paymentInfo

//       if (!MaKH || !MaLich || !SoTien || !seatData || seatData.length === 0) {
//         throw new ApiError('Thiếu dữ liệu đặt vé', 400)
//       }

//       const orderId = vnpayConfig.generateOrderId()
//       const amount = vnpayConfig.formatCurrency(SoTien)

//       // 👉 1. Lưu GHẾ TẠM GIỮ
//       // 👉 1. Lưu GHẾ TẠM GIỮ
//       for (const seat of seatData) {
//         await giaoDichTmp_Repo.createHold_Repo({
//           MaGD: orderId,
//           MaKH,
//           MaLich,
//           GheNgoi: seat.GheNgoi
//         })
//       }


//       // 👉 2. Lưu Transaction trạng thái PENDING
//       await payment_Repo.createPayment_Repo({
//         MaKH,
//         MaLich,
//         SoTien,
//         MaGD: orderId,
//       })

//       // 👉 3. Build URL VNPay
//       const paymentData = {
//         vnp_Version: '2.1.0',
//         vnp_Command: 'pay',
//         vnp_TmnCode: process.env.VNPAY_TMN_CODE,
//         vnp_Locale: 'vn',
//         vnp_CurrCode: 'VND',
//         vnp_TxnRef: orderId,
//         vnp_OrderInfo: `Thanh toán vé xem phim - Lịch chiếu ${MaLich}`,
//         vnp_OrderType: 'other',
//         vnp_Amount: amount,
//         vnp_ReturnUrl: process.env.VNPAY_RETURN_URL,
//         vnp_IpAddr: ipAddr,
//         vnp_CreateDate: new Date().toISOString().replace(/[-:T.]/g, '').substring(0, 14),
//       }

//       const paymentUrl = vnpayConfig.buildPaymentUrl(
//         paymentData,
//         process.env.VNPAY_SECRET_KEY,
//         process.env.VNPAY_URL
//       )

//       logger.info(`Tạo URL thanh toán VNPay cho ${orderId}`)
//       return { paymentUrl, orderId }
//     } catch (error) {
//       logger.error('Lỗi tạo URL thanh toán', error)
//       throw error
//     }
//   },

//   // ⭐ Callback – tạo vé khi thanh toán thành công
//   handlePaymentCallback_Service: async (vnpParams) => {
//     try {
//       const { vnp_TxnRef, vnp_ResponseCode, vnp_SecureHash } = vnpParams

//       const secureHashParams = { ...vnpParams }
//       delete secureHashParams.vnp_SecureHash
//       delete secureHashParams.vnp_SecureHashType

//       const isValid = vnpayConfig.verifySecureHash(
//         secureHashParams,
//         process.env.VNPAY_SECRET_KEY,
//         vnp_SecureHash
//       )
//       if (!isValid) throw new ApiError('Chữ ký không hợp lệ', 400)

//       const status = vnp_ResponseCode === '00' ? 'SUCCESS' : 'FAILED'
//       await payment_Repo.updatePaymentStatus_Repo(vnp_TxnRef, status, vnp_ResponseCode)

//       // 🟢 Thanh toán thành công
//       if (vnp_ResponseCode === '00') {
//         const payment = await payment_Repo.getPaymentByMaGD_Repo(vnp_TxnRef)
//         const tmpSeats = await giaoDichTmp_Repo.getByMaGD_Repo(vnp_TxnRef)

//         if (payment && tmpSeats && tmpSeats.length > 0) {
//           // tạo vé theo từng ghế
//           const tickets = tmpSeats.map(tmp => ({
//             MaKH: payment.MaKH,
//             MaLich: payment.MaLich,
//             GheNgoi: tmp.GheNgoi,
//             TongTien: payment.SoTien / tmpSeats.length,
//             TrangThai: 'ACTIVE'
//           }))

//           await ve_Repo.createMultiple_Repo(tickets)

//           // xóa record ghế tạm
//           await giaoDichTmp_Repo.deleteByMaGD_Repo(vnp_TxnRef)

//           logger.info(`Tạo ${tickets.length} vé cho ${vnp_TxnRef}`)
//         }
//       }

//       return {
//         success: vnp_ResponseCode === '00',
//         message: vnp_ResponseCode === '00' ? 'Thanh toán thành công' : 'Thanh toán thất bại',
//         orderId: vnp_TxnRef,
//       }
//     } catch (error) {
//       logger.error('Lỗi xử lý callback VNPay', error)
//       throw error
//     }
//   },

//   getPaymentHistory_Service: async (MaKH) => {
//     try {
//       const payments = await payment_Repo.getAllPayments_Repo(MaKH)
//       return payments
//     } catch (error) {
//       logger.error(`Lỗi lấy lịch sử thanh toán`, error)
//       throw error
//     }
//   },
// }
import { payment_Repo } from '../repositories/Payment_repo.js'
import { ve_Repo } from '../repositories/Ve_repo.js'
import { giaoDichTmp_Repo } from '../repositories/GiaoDichTmp_repo.js'
import { logger } from '../config/logger.js'
import { ApiError } from '../utils/ApiError.js'
import { vnpayConfig } from '../config/vnpay.config.js'

export const payment_Services = {

  /** ⭐ Tạo URL VNPay + lưu tạm ghế & dịch vụ */
  createPaymentUrl_Service: async (paymentInfo) => {
    try {
      const { MaKH, MaLich, SoTien, seatData, serviceData, ipAddr } = paymentInfo

      if (!MaKH || !MaLich || !SoTien || !seatData || seatData.length === 0) {
        throw new ApiError('Thiếu dữ liệu đặt vé', 400)
      }

      const orderId = vnpayConfig.generateOrderId()
      const amount = vnpayConfig.formatCurrency(SoTien)

      /** 1️⃣ Lưu GHẾ TẠM */
      for (const seat of seatData) {
        await giaoDichTmp_Repo.createHold_Repo({
          MaGD: orderId,
          MaKH,
          MaLich,
          GheNgoi: seat.GheNgoi
        })
      }

      /** 2️⃣ Lưu THANHTOAN chính */
      const MaTT = await payment_Repo.createPayment_Repo({
        MaKH, MaLich, SoTien, MaGD: orderId
      })

      /** 3️⃣ Lưu DỊCH VỤ nếu có */
      if (serviceData && serviceData.length > 0) {
        await payment_Repo.addServiceDetails_Repo(MaTT, serviceData)
      }

      /** 4️⃣ Build URL VNPay */
      const paymentData = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: process.env.VNPAY_TMN_CODE,
        vnp_Locale: 'vn',
        vnp_CurrCode: 'VND',
        vnp_TxnRef: orderId,
        vnp_OrderInfo: `Thanh toán vé & combo`,
        vnp_OrderType: 'billpayment',
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

      logger.info(`🔗 URL thanh toán VNPay tạo thành công: ${orderId}`)
      return { paymentUrl, orderId }

    } catch (error) {
      logger.error('❌ Lỗi tạo URL thanh toán', error)
      throw error
    }
  },

  /** ⭐ Callback VNPay khi trả về */
  // handlePaymentCallback_Service: async (vnpParams) => {
  //   try {
  //     const { vnp_TxnRef, vnp_ResponseCode, vnp_SecureHash } = vnpParams

  //     const secureHashParams = { ...vnpParams }
  //     delete secureHashParams.vnp_SecureHash
  //     delete secureHashParams.vnp_SecureHashType

  //     const isValid = vnpayConfig.verifySecureHash(
  //       secureHashParams,
  //       process.env.VNPAY_SECRET_KEY,
  //       vnp_SecureHash
  //     )
  //     if (!isValid) throw new ApiError('Chữ ký không hợp lệ', 400)

  //     if (vnp_ResponseCode === '00') {
  //       /** 🟢 THANH TOÁN OK */
  //       await payment_Repo.markCompleted_Repo(vnp_TxnRef)

  //       const payment = await payment_Repo.getPaymentByMaGD_Repo(vnp_TxnRef)

  //       // Lấy danh sách ghế đang giữ
  //       const tmpSeats = await giaoDichTmp_Repo.getByMaGD_Repo(vnp_TxnRef)

  //       /** 🎫 Tạo VÉ từ ghế */
  //       if (payment && tmpSeats && tmpSeats.length > 0) {
  //         const GiaMoiVe = payment.SoTien / tmpSeats.length

  //         const tickets = tmpSeats.map(tmp => ({
  //           MaKH: payment.MaKH,
  //           MaLich: payment.MaLich,
  //           GheNgoi: tmp.GheNgoi,
  //           TongTien: GiaMoiVe,
  //           TrangThai: 'ACTIVE'
  //         }))

  //         await ve_Repo.createMultiple_Repo(tickets)
  //       }

  //       /** 🗑 Xóa giữ ghế */
  //       await giaoDichTmp_Repo.deleteByMaGD_Repo(vnp_TxnRef)

  //       logger.info(`🎉 Thanh toán thành công & tạo vé cho ${vnp_TxnRef}`)
  //       return { success: true, orderId: vnp_TxnRef }
  //     }

  //     /** ❌ THANH TOÁN FAIL */
  //     await payment_Repo.markFailed_Repo(vnp_TxnRef, vnp_ResponseCode)
  //     await giaoDichTmp_Repo.cancelByOrderId_Repo(vnp_TxnRef)

  //     return { success: false, orderId: vnp_TxnRef }

  //   } catch (error) {
  //     logger.error('❌ Lỗi callback VNPay', error)
  //     throw error
  //   }
  // },
  // ⭐ Callback – tạo vé + dịch vụ khi thanh toán thành công
    handlePaymentCallback_Service: async (vnpParams) => {
      try {
        const { vnp_TxnRef, vnp_ResponseCode, vnp_SecureHash } = vnpParams;

        const secureHashParams = { ...vnpParams };
        delete secureHashParams.vnp_SecureHash;
        delete secureHashParams.vnp_SecureHashType;

        // ✔ Validate chữ ký
        const isValid = vnpayConfig.verifySecureHash(
          secureHashParams,
          process.env.VNPAY_SECRET_KEY,
          vnp_SecureHash
        );
        if (!isValid) throw new ApiError('Chữ ký không hợp lệ', 400);

        const status = vnp_ResponseCode === '00' ? 'SUCCESS' : 'FAILED';
        await payment_Repo.updatePaymentStatus_Repo(vnp_TxnRef, status, vnp_ResponseCode);

        // ❌ Nếu FAILED → trả về luôn
        if (vnp_ResponseCode !== '00') {
          logger.warn(`Thanh toán thất bại: ${vnp_TxnRef}`);
          return { success: false, orderId: vnp_TxnRef };
        }

        // 🟢 THANH TOÁN THÀNH CÔNG
        const payment = await payment_Repo.getPaymentByMaGD_Repo(vnp_TxnRef);
        if (!payment) throw new ApiError('Không tìm thấy giao dịch để duyệt', 404);

        // Lấy ghế tạm
        const tmpSeats = await giaoDichTmp_Repo.getByMaGD_Repo(vnp_TxnRef);

        // Lấy dịch vụ tạm
        const tmpServices = await giaoDichTmp_Repo.getServicesByMaGD_Repo(vnp_TxnRef);

        /** === TẠO VÉ === */
        if (tmpSeats && tmpSeats.length > 0) {
          const tongTienChoVe = payment.SoTien - (tmpServices?.reduce((s, x) => s + x.Gia * x.SoLuong, 0) || 0);
          const giaMoiVe = tongTienChoVe / tmpSeats.length;

          const tickets = tmpSeats.map(tmp => ({
            MaKH: payment.MaKH,
            MaLich: payment.MaLich,
            GheNgoi: tmp.GheNgoi,
            TongTien: giaMoiVe,
            TrangThai: 'ACTIVE'
          }));

          await ve_Repo.createMultiple_Repo(tickets);
          await giaoDichTmp_Repo.deleteByMaGD_Repo(vnp_TxnRef);
          logger.info(`Đã tạo ${tickets.length} vé cho ${vnp_TxnRef}`);
        }

        /** === LƯU DỊCH VỤ === */
        if (tmpServices && tmpServices.length > 0) {
          await payment_Repo.savePaymentServices_Repo(vnp_TxnRef, tmpServices);
          await giaoDichTmp_Repo.deleteServicesByMaGD_Repo(vnp_TxnRef);
          logger.info(`Đã ghi ${tmpServices.length} dịch vụ cho ${vnp_TxnRef}`);
        }

        return {
          success: true,
          message: 'Thanh toán thành công',
          orderId: vnp_TxnRef,
        };

      } catch (error) {
        logger.error('Lỗi xử lý callback VNPay', error);
        throw error;
      }
    },


  /** 📜 Lịch sử giao dịch */
  getPaymentHistory_Service: async (MaKH) => {
    try {
      return await payment_Repo.getAllPayments_Repo(MaKH)
    } catch (error) {
      logger.error(`❌ Lỗi lịch sử thanh toán`, error)
      throw error
    }
  },
}
