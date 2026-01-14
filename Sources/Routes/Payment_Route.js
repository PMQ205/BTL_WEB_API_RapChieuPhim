import express from 'express'
import { payment_Controller } from '../Controllers/Payment_Controller.js'
import { authenticate } from '../middleware/auth.middleware.session.js'

const router = express.Router()

// API cũ VNPay (không dùng trong demo MoMo nhưng giữ lại)
router.post('/create-payment-url', authenticate, payment_Controller.createPaymentUrl)

// DEMO: giữ ghế + tạo giao dịch tạm
router.post('/demo-hold', authenticate, payment_Controller.demoHold)

// DEMO: hoàn tất thanh toán, tạo vé
router.post('/demo-complete', authenticate, payment_Controller.demoComplete)

// DEMO: lấy thông tin giao dịch tạm để thanh toán lại
router.get('/pending/:orderId', authenticate, payment_Controller.getPendingInfo)

// API: Callback từ VNPay (không cần đăng nhập)
router.get('/vnpay-return', payment_Controller.paymentReturn)

// API: Webhook từ VNPay (không cần đăng nhập)
router.get('/vnpay-notify', payment_Controller.paymentNotify)

// API: Lấy lịch sử thanh toán (cần đăng nhập)
router.get('/history', authenticate, payment_Controller.getPaymentHistory)

export default router
