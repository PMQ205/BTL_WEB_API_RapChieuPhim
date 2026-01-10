import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { authRepo } from '../../repositories/Auth_repo.js'
import { ApiError } from '../../utils/ApiError.js'

export const authService = {
  register: async (data) => {
    // Validate Email là bắt buộc
    if (!data.Email) {
      throw new ApiError('Email là bắt buộc', 400)
    }

    // Kiểm tra tên đăng nhập đã tồn tại
    const existUsername = await authRepo.findByUsername(data.TenDangNhap)
    if (existUsername) throw new ApiError('Tên đăng nhập đã tồn tại', 409)

    // Kiểm tra email đã tồn tại
    const existEmail = await authRepo.findByEmail(data.Email)
    if (existEmail) throw new ApiError('Email đã được sử dụng', 409)

    const passwordHash = bcrypt.hashSync(data.MatKhau, 10)

    return await authRepo.createUser({
      TenKH: data.TenKH,
      TenDangNhap: data.TenDangNhap,
      Email: data.Email,
      MatKhau: passwordHash,
      MaRole: 3, // CUSTOMER
    })
  },

  login: async (username, password) => {
    const user = await authRepo.findByUsername(username)
    if (!user) throw new ApiError('Sai tài khoản hoặc mật khẩu', 401)

    const ok = bcrypt.compareSync(password, user.MatKhau)
    if (!ok) throw new ApiError('Sai tài khoản hoặc mật khẩu', 401)

    const token = jwt.sign({ id: user.MaKH, role: user.MaRole }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })

    return token
  },
}
