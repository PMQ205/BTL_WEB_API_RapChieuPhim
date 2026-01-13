import express from 'express'
import { ve_Controller } from '../Controllers/Ve_Controller.js'
import { authenticate } from '../middleware/auth.middleware.session.js'

const router = express.Router()

// Tất cả routes đều cần đăng nhập
router.use(authenticate)

// API REST
router.get('/', ve_Controller.getAll)
router.get('/:id', ve_Controller.getById)
router.post('/', ve_Controller.create)
router.delete('/:id', ve_Controller.delete)

export default router
