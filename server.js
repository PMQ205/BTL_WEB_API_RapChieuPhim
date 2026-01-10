import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import session from 'express-session'
import path from 'path'

import './Sources/config/Database/db.js'
import { logger } from './Sources/config/logger.js'
//---------------------------------------------routers----------------------------------------------
import Film_Router from './Sources/Routes/Film_Route.js'
import Auth_Router from './Sources/Routes/Auth_Route.js'
import LichChieu_Router from './Sources/Routes/LichChieu_Route.js'
import PhongChieu_Router from './Sources/Routes/PhongChieu_Route.js'
import Ve_Router from './Sources/Routes/Ve_Route.js'
import homeRoute from './Sources/Routes/home.Route.View.js'
import { setUserLocals } from './Sources/middleware/session.middleware.js'

import { errorHandler } from './Sources/middleware/error.middleware.js'

const app = express()

/* ===== VIEW ENGINE ===== */
app.set('view engine', 'ejs') // khai báo với express rằng sẽ dùng ejs để render giao diện

app.set('views', path.join(process.cwd(), 'Sources/views')) //Chỉ định thư mục chứa các file giao diện
app.use(express.static(path.join(process.cwd(), 'Sources/public')))

/* ===== MIDDLEWARE ===== */
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

/* ===== SESSION (PHẢI TRƯỚC ROUTER) ===== */
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'flix_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set true nếu dùng HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
)

// Middleware để set user info cho views
app.use(setUserLocals)

/* ===== ROUTES ===== */

app.use('/api/auth', Auth_Router) // AUTH API
app.use('/api/films', Film_Router) // FILMS API
app.use('/api/lichchieu', LichChieu_Router) // LICHCHIEU API
app.use('/api/phongchieu', PhongChieu_Router) // PHONGCHIEU API
app.use('/api/ve', Ve_Router) // VE API
app.use('/', homeRoute) // VIEWS

/* ===== ERROR HANDLER ===== */
app.use(errorHandler)

/* ===== START SERVER ===== */
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  logger.info(`Server đang chạy tại http://localhost:${PORT}`)
})
