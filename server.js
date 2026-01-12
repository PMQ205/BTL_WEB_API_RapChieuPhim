import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import session from 'express-session';
import path from 'path';
import passport from './Sources/config/passport.js';

import './Sources/config/Database/db.js';
import { logger } from './Sources/config/logger.js';

// Routers
import Film_Router from './Sources/Routes/Film_Route.js';
import Auth_Router from './Sources/Routes/Auth_Route.js';
import LichChieu_Router from './Sources/Routes/LichChieu_Route.js';
import PhongChieu_Router from './Sources/Routes/PhongChieu_Route.js';
import Ve_Router from './Sources/Routes/Ve_Route.js';
import Payment_Router from './Sources/Routes/Payment_Route.js';
import homeRoute from './Sources/Routes/home.Route.View.js';
import authOAuth from './Sources/Routes/auth_oauth.js';

import { setUserLocals } from './Sources/middleware/session.middleware.js';
import { errorHandler } from './Sources/middleware/error.middleware.js';
import { payment_Controller } from './Sources/Controllers/Payment_Controller.js';

import './Sources/cron/clearExpiredSeats.js';


const app = express();

/* ===== VIEW ENGINE ===== */
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'Sources/views'));
app.use(express.static(path.join(process.cwd(), 'Sources/public')));

/* ===== SECURITY + BODY PARSE ===== */
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(compression());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

/* ===== SESSION + PASSPORT ===== */
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'supersecret123',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,           // đổi true nếu chạy HTTPS
      httpOnly: true,
      sameSite: 'lax',         // THÊM DÒNG NÀY
      maxAge: 24 * 60 * 60 * 1000, // 24h
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

/* ===== DEBUG WHO IS LOGGED ===== */
app.use((req, res, next) => {
  console.log(
    '>> CHECK USER:',
    !!req.user,
    req.user ? req.user.TenDangNhap || req.user.Email : null
  );
  next();
});

/* ===== PASS DATA TO VIEWS ===== */
app.use(setUserLocals);

/* ===== ROUTES ===== */
app.use('/auth', authOAuth);     // OAuth
app.use('/api/auth', Auth_Router);
app.use('/api/films', Film_Router);
app.use('/api/lichchieu', LichChieu_Router);
app.use('/api/phongchieu', PhongChieu_Router);
app.use('/api/ve', Ve_Router);
app.use('/api/payment', Payment_Router);

// Payment success/failed pages
app.get('/payment-success', payment_Controller.paymentSuccessPage);
app.get('/payment-failed', payment_Controller.paymentFailedPage);

// Payment booking page (after seats selected)
app.get('/payment-booking', (req, res) => {
  res.render('payment-booking');
});

app.use('/', homeRoute);

/* ===== ERRORS ===== */
app.use(errorHandler);

/* ===== START ===== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server chạy tại http://localhost:${PORT}`);
});
