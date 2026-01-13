import express from 'express'
import { film_Services } from '../Services/Film/Film_services.js'
import { lichChieu_Services } from '../Services/LichChieu/LichChieu_services.js'
import { ve_Services } from '../Services/Ve/Ve_services.js'
import { authController_View } from '../Controllers/Auth_Controller_View.js'
import { requireAuth } from '../middleware/session.middleware.js'
import { logger } from '../config/logger.js'
import { giaoDichTmp_Repo } from '../repositories/GiaoDichTmp_repo.js'
// import { dichVu_Services } from '../Services/DichVu/DichVu_services.js';

const router = express.Router()

// 🏠 Home page
router.get('/', async (req, res) => {
  try {
    const [
      heroFilms,
      moviesFilms,
      seriesFilms,
      cartoonsFilms,
      topMoviesFilms
    ] = await Promise.all([
      film_Services.getFeaturedFilms_Service('NEW', 3).catch(() => []),
      film_Services.getFilmsByLoai_Service('MOVIE').catch(() => []),
      film_Services.getFilmsByLoai_Service('SERIES').catch(() => []),
      film_Services.getFilmsByLoai_Service('CARTOON').catch(() => []),
      film_Services.getFeaturedFilms_Service(6).catch(() => []),
    ])

    res.render('home', {
      heroFilms,
      moviesFilms,
      seriesFilms,
      cartoonsFilms,
      topMoviesFilms
    })
  } catch (err) {
    logger.error('Home render error:', err)
    res.render('home', {
      heroFilms: [],
      moviesFilms: [],
      seriesFilms: [],
      cartoonsFilms: [],
      topMoviesFilms: []
    })
  }
})


// 🎬 Film detail
router.get('/film/:id', async (req, res) => {
  try {
    const MaPhim = Number(req.params.id)
    if (Number.isNaN(MaPhim)) return res.status(400).render('error', { message: 'ID phim không hợp lệ' })

    const films = await film_Services.getFilmsByID_Service(MaPhim)
    if (!films || films.length === 0) return res.status(404).render('error', { message: 'Không tìm thấy phim' })

    const showtimes = await lichChieu_Services.getByFilmId_Service(MaPhim).catch(() => [])

    res.render('film-detail', { film: films[0], showtimes })
  } catch (err) {
    logger.error('Film-detail error:', err)
    res.status(500).render('error', { message: 'Đã có lỗi xảy ra' })
  }
})


// 🎟 Showtimes + seats
router.get('/showtimes/:id', async (req, res) => {
  try {
    const MaLich = Number(req.params.id)
    if (Number.isNaN(MaLich)) return res.status(400).render('error', { message: 'ID lịch chiếu không hợp lệ' })

    const showtime = await lichChieu_Services.getById_Service(MaLich)
    if (!showtime) return res.status(404).render('error', { message: 'Không tìm thấy lịch chiếu' })

    const allShowtimes = await lichChieu_Services.getByFilmId_Service(showtime.MaPhim).catch(() => [])

    const bookedSeatsVE = await lichChieu_Services.getBookedSeats_Service(MaLich).catch(() => [])
    const bookedSeatsTMP = await lichChieu_Services.getPendingSeats_Service(MaLich).catch(() => [])

    const bookedSeats = [...new Set([...bookedSeatsVE, ...bookedSeatsTMP])]

    res.render('seats', { showtime, allShowtimes, bookedSeats, isAuthenticated: !!req.session.user })
  } catch (err) {
    logger.error('Seats page error:', err)
    res.status(500).render('error', { message: 'Đã có lỗi xảy ra' })
  }
})


// 🎫 Tickets page
router.get('/tickets', requireAuth, async (req, res) => {
  try {
    const MaKH = req.session.user.MaKH || req.session.user.id
    const pendingTickets = await giaoDichTmp_Repo.getPendingDetailedByUser_Repo(MaKH)
    const tickets = await ve_Services.getAll_Service(MaKH)
    res.render('tickets', { tickets, pendingTickets })
  } catch (err) {
    logger.error('Tickets error:', err)
    res.status(500).render('error', { message: 'Đã có lỗi xảy ra' })
  }
})


// 🎥 Movies page
router.get('/movies', async (req, res) => {
  try {
    const [movies, cartoons] = await Promise.all([
      film_Services.getFilmsByLoai_Service('MOVIE').catch(() => []),
      film_Services.getFilmsByLoai_Service('CARTOON').catch(() => [])
    ])

    res.render('movie-page', { moviesFilms: [...movies, ...cartoons], title: 'Phim Lẻ & Hoạt Hình' })
  } catch (err) {
    logger.error('Movie-page error:', err)
    res.render('error', { message: 'Không thể tải danh sách phim' })
  }
})


// 📺 Series page
router.get('/series', async (req, res) => {
  try {
    const seriesFilms = await film_Services.getFilmsByLoai_Service('SERIES').catch(() => [])
    res.render('series-page', { seriesFilms, title: 'Phim Bộ' })
  } catch (err) {
    logger.error('Series-page error:', err)
    res.render('error', { message: 'Đã có lỗi xảy ra' })
  }
})

// router.get('/services', async (req, res) => {
//   try {
//     const services = await dichVu_Services.getAll_Service();
//     res.render('services', { services });
//   } catch (err) {
//     res.render('error', { message: 'Không tải được dịch vụ' });
//   }
// });

// 👤 Auth views
router.get('/login', authController_View.showLogin)
router.post('/login', authController_View.login)

router.get('/register', authController_View.showRegister)
router.post('/register', authController_View.register)

router.get('/register-plan', (req, res) => res.render('register-plan', { error: null }))
router.post('/register-plan', authController_View.register)

router.get('/logout', authController_View.logout)

export default router
