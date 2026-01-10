import { phongChieu_Repo } from '../repositories/PhongChieu_repo.js'
import { logger } from '../config/logger.js'
import { ApiError } from '../utils/ApiError.js'

export const phongChieu_Controller = {
  getAll: async (req, res, next) => {
    try {
      const phongChieus = await phongChieu_Repo.getAll_Repo()
      res.status(200).json(phongChieus)
    } catch (error) {
      next(error)
    }
  },

  getById: async (req, res, next) => {
    try {
      const MaPhong = Number(req.params.id)
      if (Number.isNaN(MaPhong)) {
        return res.status(400).json({ message: 'MaPhong không hợp lệ' })
      }
      const phongChieu = await phongChieu_Repo.getById_Repo(MaPhong)
      if (!phongChieu) {
        return res.status(404).json({ message: 'Không tìm thấy phòng chiếu' })
      }
      res.status(200).json(phongChieu)
    } catch (error) {
      next(error)
    }
  },

  create: async (req, res, next) => {
    try {
      if (!req.body.TenPhong || !req.body.SucChua) {
        return res.status(400).json({ message: 'TenPhong và SucChua là bắt buộc' })
      }
      const insertId = await phongChieu_Repo.create_Repo({
        TenPhong: req.body.TenPhong,
        SucChua: Number(req.body.SucChua),
      })
      res.status(201).json({ insertId })
    } catch (error) {
      next(error)
    }
  },

  update: async (req, res, next) => {
    try {
      const MaPhong = Number(req.params.id)
      if (Number.isNaN(MaPhong)) {
        return res.status(400).json({ message: 'MaPhong không hợp lệ' })
      }
      const data = {}
      if (req.body.TenPhong) data.TenPhong = req.body.TenPhong
      if (req.body.SucChua) data.SucChua = Number(req.body.SucChua)

      const affectedRows = await phongChieu_Repo.update_Repo(MaPhong, data)
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Không tìm thấy phòng chiếu' })
      }
      res.status(200).json({ message: 'Cập nhật thành công' })
    } catch (error) {
      next(error)
    }
  },

  delete: async (req, res, next) => {
    try {
      const MaPhong = Number(req.params.id)
      if (Number.isNaN(MaPhong)) {
        return res.status(400).json({ message: 'MaPhong không hợp lệ' })
      }
      await phongChieu_Repo.delete_Repo(MaPhong)
      res.status(200).json({ message: 'Xóa thành công' })
    } catch (error) {
      if (error.message) {
        return res.status(400).json({ message: error.message })
      }
      next(error)
    }
  },
}
