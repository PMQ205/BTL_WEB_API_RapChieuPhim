import express from 'express'
import { gioHangDv_Controller } from '../Controllers/GioHangDv_Controller.js'
import { authenticate } from '../middleware/auth.middleware.session.js'

const router = express.Router()

// Tất cả API giỏ hàng cần login
router.use(authenticate)

//  Thêm vào giỏ / tăng số lượng món
router.post('/add', gioHangDv_Controller.add)

//  Lấy giỏ hàng của user
router.get('/', gioHangDv_Controller.getMyCart)

//  Xóa 1 món trong giỏ
router.delete('/remove/:id', gioHangDv_Controller.removeOne)

// Xóa toàn bộ giỏ hàng
router.delete('/clear', gioHangDv_Controller.clearAll)

// 🔼🔽 Cập nhật số lượng (tăng/giảm)
router.put('/update', gioHangDv_Controller.updateQty)

export default router
