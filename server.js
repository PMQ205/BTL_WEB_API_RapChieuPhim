import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import session from 'express-session'
import path from 'path'
import passport from './Sources/config/passport.js'

// DB + logger
import './Sources/config/Database/db.js'
import { logger } from './Sources/config/logger.js'

// Routers (API)
import Film_Router from './Sources/Routes/Film_Route.js'
import Auth_Router from './Sources/Routes/Auth_Route.js'
import LichChieu_Router from './Sources/Routes/LichChieu_Route.js'
import PhongChieu_Router from './Sources/Routes/PhongChieu_Route.js'
import Ve_Router from './Sources/Routes/Ve_Route.js'
import Payment_Router from './Sources/Routes/Payment_Route.js'

// View Routers
import homeRoute from './Sources/Routes/home.Route.View.js'
import DichVu_Router from './Sources/Routes/DichVu_Route.js'

// OAuth
import authOAuth from './Sources/Routes/auth_oauth.js'

// Middleware
import { setUserLocals } from './Sources/middleware/session.middleware.js'
import { errorHandler } from './Sources/middleware/error.middleware.js'

// Payment view controller
import { payment_Controller } from './Sources/Controllers/Payment_Controller.js'

import Admin_Router from './Sources/Routes/Admin_Route.js';

// Cron job
import './Sources/cron/clearExpiredSeats.js'

import gioHangDv_Route from './Sources/Routes/GioHangDv_Route.js'

const app = express()

/* ========================= VIEW ENGINE ========================= */
app.set('view engine', 'ejs')
app.set('views', path.join(process.cwd(), 'Sources/views'))
app.use(express.static(path.join(process.cwd(), 'Sources/public')))

/* ========================= SECURITY + BODY PARSE ========================= */
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
)

app.use(
  cors({
    origin: true,
    credentials: true,
  })
)

app.use(compression())
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true }))

/* ========================= SESSION + PASSPORT ========================= */
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'supersecret123',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
)

app.use(passport.initialize())
app.use(passport.session())

/* ========================= DEBUG USER ========================= */
app.use((req, res, next) => {
  console.log(
    '>> CHECK USER:',
    !!req.user,
    req.user ? req.user.TenDangNhap || req.user.Email : null
  )
  next()
})

/* ========================= PASS USER TO VIEW ========================= */
app.use(setUserLocals)

/* ========================= ROUTES ========================= */
// OAuth
app.use('/auth', authOAuth)

// API routes
app.use('/api/auth', Auth_Router)
app.use('/api/films', Film_Router)
app.use('/api/lichchieu', LichChieu_Router)
app.use('/api/phongchieu', PhongChieu_Router)
app.use('/api/ve', Ve_Router)
app.use('/api/payment', Payment_Router)

// ⭐ ⭐ DỊCH VỤ + GIỎ
app.use('/services', DichVu_Router)
app.use('/api/giohangdv', gioHangDv_Route)
// Payment result pages
app.get('/payment-success', payment_Controller.paymentSuccessPage)
app.get('/payment-failed', payment_Controller.paymentFailedPage)

// Seat -> Payment page
app.get('/payment-booking', (req, res) => {
  res.render('payment-booking')
})
// admin
app.use('/admin', Admin_Router);

// Home + movies UI
app.use('/', homeRoute)

/* ========================= ERRORS ========================= */
app.use(errorHandler)

/* ========================= START SERVER ========================= */
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  logger.info(`🚀 Server chạy tại http://localhost:${PORT}`)
})
