import express from 'express'
import { payment_Controller } from '../Controllers/Payment_Controller.js'
import { authenticate } from '../middleware/auth.middleware.session.js'

const router = express.Router()

// API: Tạo URL thanh toán (cần đăng nhập)
router.post('/create-payment-url', authenticate, payment_Controller.createPaymentUrl)

// API: Callback từ VNPay (không cần đăng nhập)
router.get('/vnpay-return', payment_Controller.paymentReturn)

// API: Webhook từ VNPay (không cần đăng nhập)
router.get('/vnpay-notify', payment_Controller.paymentNotify)

// API: Lấy lịch sử thanh toán (cần đăng nhập)
router.get('/history', authenticate, payment_Controller.getPaymentHistory)

export default router
