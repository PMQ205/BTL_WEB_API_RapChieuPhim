import express from 'express'
import { dichVu_Services } from '../Services/DichVu/DichVu_services.js'
import { authenticate } from '../middleware/auth.middleware.session.js'

const router = express.Router()

// VIEW trang dịch vụ
router.get('/', async (req, res) => {
  const services = await dichVu_Services.getAll_Service()
  res.render('services', { services })
})

// VIEW giỏ dịch vụ
router.get('/cart', (req, res) => {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    res.render('services-cart');
  });
  
router.get('/checkout', authenticate, (req, res) => {
    
    res.render('payment-service')
  })

export default router
