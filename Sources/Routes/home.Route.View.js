import express from 'express'
import { film_Services } from '../Services/Film/Film_services.js'
import { lichChieu_Services } from '../Services/LichChieu/LichChieu_services.js'
import { ve_Services } from '../Services/Ve/Ve_services.js'
import { authController_View } from '../Controllers/Auth_Controller_View.js'
import { requireAuth } from '../middleware/session.middleware.js'
import { logger } from '../config/logger.js'

const router = express.Router()

// Home page
router.get('/', async (req, res) => {
  try {
    // Lấy dữ liệu từ database
    const [heroFilms, moviesFilms, seriesFilms, cartoonsFilms, topMoviesFilms] = await Promise.all([
      film_Services.getFeaturedFilms_Service('NEW', 3).catch((err) => {
        logger.error('Lỗi lấy hero films:', err)
        return []
      }),
      film_Services.getFilmsByLoai_Service('MOVIE').catch((err) => {
        logger.error('Lỗi lấy movies:', err)
        return []
      }),
      film_Services.getFilmsByLoai_Service('SERIES').catch((err) => {
        logger.error('Lỗi lấy series:', err)
        return []
      }),
      film_Services.getFilmsByLoai_Service('CARTOON').catch((err) => {
        logger.error('Lỗi lấy cartoons:', err)
        return []
      }),
      film_Services.getFeaturedFilms_Service(6).catch((err) => {
        logger.error('Lỗi lấy top movies:', err)
        return []
      }),
    ])

    logger.info(
      `Home page - Hero: ${heroFilms.length}, Movies: ${moviesFilms.length}, Series: ${seriesFilms.length}, Cartoons: ${cartoonsFilms.length}, Top: ${topMoviesFilms.length}`
    )

    // Truyền dữ liệu vào view (luôn truyền kể cả mảng rỗng để view có thể kiểm tra)
    res.render('home', {
      heroFilms: heroFilms.length > 0 ? heroFilms : [],
      moviesFilms: moviesFilms.length > 0 ? moviesFilms : [],
      seriesFilms: seriesFilms.length > 0 ? seriesFilms : [],
      cartoonsFilms: cartoonsFilms.length > 0 ? cartoonsFilms : [],
      topMoviesFilms: topMoviesFilms.length > 0 ? topMoviesFilms : [],
    })
  } catch (error) {
    logger.error('Lỗi render home page:', error)
    // Nếu có lỗi, vẫn render với dữ liệu mặc định
    res.render('home', {
      heroFilms: [],
      moviesFilms: [],
      seriesFilms: [],
      cartoonsFilms: [],
      topMoviesFilms: [],
    })
  }
})

// Film detail page
router.get('/film/:id', async (req, res) => {
  try {
    const MaPhim = Number(req.params.id)
    if (Number.isNaN(MaPhim)) {
      return res.status(400).render('error', { message: 'ID phim không hợp lệ' })
    }

    const films = await film_Services.getFilmsByID_Service(MaPhim)
    if (!films || films.length === 0) {
      return res.status(404).render('error', { message: 'Không tìm thấy phim' })
    }

    const film = films[0]
    const showtimes = await lichChieu_Services.getByFilmId_Service(MaPhim).catch(() => [])

    res.render('film-detail', {
      film: film,
      showtimes: showtimes,
    })
  } catch (error) {
    logger.error('Lỗi render film detail:', error)
    res.status(500).render('error', { message: 'Đã có lỗi xảy ra' })
  }
})

// Showtimes/Seats page
router.get('/showtimes/:id', async (req, res) => {
  try {
    const MaLich = Number(req.params.id)
    if (Number.isNaN(MaLich)) {
      return res.status(400).render('error', { message: 'ID lịch chiếu không hợp lệ' })
    }

    const showtime = await lichChieu_Services.getById_Service(MaLich)
    if (!showtime) {
      return res.status(404).render('error', { message: 'Không tìm thấy lịch chiếu' })
    }

    // Lấy tất cả lịch chiếu của phim
    const allShowtimes = await lichChieu_Services
      .getByFilmId_Service(showtime.MaPhim)
      .catch(() => [])

    // 🔥 Lấy ghế đã ĐẶT
    const bookedSeatsVE = await lichChieu_Services.getBookedSeats_Service(MaLich).catch(() => [])

    // 🔥 Lấy ghế đang GIỮ (PENDING)
    const bookedSeatsTMP = await lichChieu_Services.getPendingSeats_Service(MaLich).catch(() => [])

    // 🔥 Gộp cả hai danh sách
    const bookedSeats = [...new Set([...bookedSeatsVE, ...bookedSeatsTMP])]

    res.render('seats', {
      showtime,
      allShowtimes,
      bookedSeats,
      isAuthenticated: !!req.session.user
    })
  } catch (error) {
    logger.error('Lỗi render showtimes:', error)
    res.status(500).render('error', { message: 'Đã có lỗi xảy ra' })
  }
})


// Tickets page (user's tickets)
router.get('/tickets', requireAuth, async (req, res) => {
  try {
    const tickets = await ve_Services.getAll_Service(req.session.user.id)
    res.render('tickets', { tickets })
  } catch (error) {
    logger.error('Lỗi render tickets:', error)
    res.status(500).render('error', { message: 'Đã có lỗi xảy ra' })
  }
})

// Debug route - kiểm tra dữ liệu (chỉ dùng khi development)
router.get('/debug/films', async (req, res) => {
  try {
    const allFilms = await film_Services.getAllFilms_Service().catch(() => [])
    const movies = await film_Services.getFilmsByLoai_Service('MOVIE').catch(() => [])
    const series = await film_Services.getFilmsByLoai_Service('SERIES').catch(() => [])
    const cartoons = await film_Services.getFilmsByLoai_Service('CARTOON').catch(() => [])

    res.json({
      total: allFilms.length,
      movies: movies.length,
      series: series.length,
      cartoons: cartoons.length,
      allFilms: allFilms.slice(0, 5), // Hiển thị 5 phim đầu tiên
      sampleMovies: movies.slice(0, 3),
      sampleSeries: series.slice(0, 3),
      sampleCartoons: cartoons.slice(0, 3),
    })
  } catch (error) {
    logger.error('Debug films error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Auth routes
router.get('/login', authController_View.showLogin)
router.post('/login', authController_View.login)
router.get('/register', authController_View.showRegister)
router.post('/register', authController_View.register)
router.get('/register-plan', (req, res) => {
  res.render('register-plan', { error: null })
})
router.post('/register-plan', authController_View.register)
router.get('/logout', authController_View.logout)

export default router
