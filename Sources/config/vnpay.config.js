import crypto from 'crypto'
import qs from 'qs'

export const vnpayConfig = {
  // Tính toán checksum VNPay
  sortObject: (obj) => {
    const sorted = {}
    const keys = Object.keys(obj).sort()
    keys.forEach((key) => {
      sorted[key] = obj[key]
    })
    return sorted
  },

  buildSecureHash: (data, secretKey) => {
    const sortedData = vnpayConfig.sortObject(data)
    const signData = qs.stringify(sortedData, { encode: false })
    return crypto
      .createHmac('sha512', secretKey)
      .update(Buffer.from(signData, 'utf-8'))
      .digest('hex')
  },

  verifySecureHash: (data, secretKey, signature) => {
    const hash = vnpayConfig.buildSecureHash(data, secretKey)
    return hash === signature
  },

  // Tạo mã giao dịch unique
  generateOrderId: () => {
    return Date.now().toString()
  },

  // Format tiền tệ (VNĐ -> số nguyên)
  formatCurrency: (amount) => {
    return Math.round(amount * 100)
  },

  // Tạo URL thanh toán VNPay
  buildPaymentUrl: (paymentData, secretKey, vnpayUrl) => {
    const data = vnpayConfig.sortObject(paymentData)
    const signData = qs.stringify(data, { encode: false })
    const signature = crypto
      .createHmac('sha512', secretKey)
      .update(Buffer.from(signData, 'utf-8'))
      .digest('hex')

    data.vnp_SecureHash = signature
    return `${vnpayUrl}?${qs.stringify(data, { encode: false })}`
  },
}