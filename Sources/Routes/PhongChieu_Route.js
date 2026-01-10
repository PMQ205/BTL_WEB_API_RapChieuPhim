import express from 'express'
import { phongChieu_Controller } from '../Controllers/PhongChieu_Controller.js'
import { authenticate } from '../middleware/auth.middleware.js'
import { authorize } from '../middleware/authorize.middleware.js'

const router = express.Router()

// Public routes
router.get('/', phongChieu_Controller.getAll)
router.get('/:id', phongChieu_Controller.getById)

// Protected routes - Admin/Staff only
router.post('/', authenticate, authorize([1, 2]), phongChieu_Controller.create)
router.put('/:id', authenticate, authorize([1, 2]), phongChieu_Controller.update)
router.delete('/:id', authenticate, authorize([1, 2]), phongChieu_Controller.delete)

export default router
