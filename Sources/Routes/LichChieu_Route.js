import express from 'express'
import { lichChieu_Controller } from '../Controllers/LichChieu_Controller.js'
import { authenticate } from '../middleware/auth.middleware.js'
import { authorize } from '../middleware/authorize.middleware.js'

const router = express.Router()

// Public routes
router.get('/', lichChieu_Controller.getAll)
router.get('/film/:filmId', lichChieu_Controller.getByFilmId)
router.get('/:id/seats', lichChieu_Controller.getBookedSeats)
router.get('/:id', lichChieu_Controller.getById)

// Protected routes - Admin/Staff only
router.post('/', authenticate, authorize([1, 2]), lichChieu_Controller.create)
router.put('/:id', authenticate, authorize([1, 2]), lichChieu_Controller.update)
router.delete('/:id', authenticate, authorize([1, 2]), lichChieu_Controller.delete)

export default router
