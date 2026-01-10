import { authService } from '../Services/auth/Auth_services.js'
import { authRepo } from '../repositories/Auth_repo.js'
import { logger } from '../config/logger.js'

export const authController_View = {
  showLogin: (req, res) => {
    // Nếu đã đăng nhập, redirect về home
    if (req.session.user) {
      return res.redirect('/')
    }
    res.render('auth/login', {
      error: null,
      redirect: req.query.redirect || '/',
    })
  },

  showRegister: (req, res) => {
    // Nếu đã đăng nhập, redirect về home
    if (req.session.user) {
      return res.redirect('/')
    }
    res.render('auth/register', { error: null })
  },

  login: async (req, res) => {
    try {
      const { TenDangNhap, MatKhau, redirect } = req.body

      if (!TenDangNhap || !MatKhau) {
        return res.render('auth/login', {
          error: 'Vui lòng điền đầy đủ thông tin',
          redirect: redirect || '/',
        })
      }

      const user = await authRepo.findByUsername(TenDangNhap)
      if (!user) {
        return res.render('auth/login', {
          error: 'Sai tên đăng nhập hoặc mật khẩu',
          redirect: redirect || '/',
        })
      }

      const bcrypt = await import('bcryptjs')
      const ok = bcrypt.default.compareSync(MatKhau, user.MatKhau)
      if (!ok) {
        return res.render('auth/login', {
          error: 'Sai tên đăng nhập hoặc mật khẩu',
          redirect: redirect || '/',
        })
      }

      // Lưu thông tin user vào session
      req.session.user = {
        id: user.MaKH,
        username: user.TenDangNhap,
        name: user.TenKH,
        role: user.MaRole,
      }

      const redirectUrl = redirect || '/'
      res.redirect(redirectUrl)
    } catch (error) {
      logger.error('Lỗi đăng nhập view:', error)
      res.render('auth/login', {
        error: 'Đã có lỗi xảy ra, vui lòng thử lại',
        redirect: req.body.redirect || '/',
      })
    }
  },

  register: async (req, res) => {
    try {
      const { TenKH, Email, TenDangNhap, MatKhau, MatKhauXacNhan } = req.body

      // Validate các trường bắt buộc
      if (!TenKH || !Email || !TenDangNhap || !MatKhau || !MatKhauXacNhan) {
        return res.render('auth/register', {
          error: 'Vui lòng điền đầy đủ thông tin',
        })
      }

      // Validate định dạng email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(Email)) {
        return res.render('auth/register', {
          error: 'Email không hợp lệ',
        })
      }

      // Validate mật khẩu xác nhận
      if (MatKhau !== MatKhauXacNhan) {
        return res.render('auth/register', {
          error: 'Mật khẩu xác nhận không khớp',
        })
      }

      // Validate độ dài mật khẩu
      if (MatKhau.length < 6) {
        return res.render('auth/register', {
          error: 'Mật khẩu phải có ít nhất 6 ký tự',
        })
      }

      // Đăng ký tài khoản
      await authService.register({
        TenKH,
        Email,
        TenDangNhap,
        MatKhau,
      })

      // Tự động đăng nhập sau khi đăng ký
      const user = await authRepo.findByUsername(TenDangNhap)
      req.session.user = {
        id: user.MaKH,
        username: user.TenDangNhap,
        name: user.TenKH,
        email: user.Email,
        role: user.MaRole,
      }

      res.redirect('/')
    } catch (error) {
      logger.error('Lỗi đăng ký view:', error)
      res.render('auth/register', {
        error: error.message || 'Đã có lỗi xảy ra, vui lòng thử lại',
      })
    }
  },

  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        logger.error('Lỗi khi logout:', err)
      }
      res.redirect('/')
    })
  },
}
