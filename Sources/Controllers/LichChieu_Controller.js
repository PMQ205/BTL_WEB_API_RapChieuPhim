import { lichChieu_Services } from '../Services/LichChieu/LichChieu_services.js'
import { CreateLichChieuDTO } from '../dtos/LichChieu/create_LichChieu.dto.js'
import { logger } from '../config/logger.js'

export const lichChieu_Controller = {
  getAll: async (req, res, next) => {
    try {
      const lichChieus = await lichChieu_Services.getAll_Service()
      res.status(200).json(lichChieus)
    } catch (error) {
      next(error)
    }
  },

  getById: async (req, res, next) => {
    try {
      const MaLich = Number(req.params.id)
      if (Number.isNaN(MaLich)) {
        return res.status(400).json({ message: 'MaLich không hợp lệ' })
      }
      const lichChieu = await lichChieu_Services.getById_Service(MaLich)
      res.status(200).json(lichChieu)
    } catch (error) {
      next(error)
    }
  },

  getByFilmId: async (req, res, next) => {
    try {
      const MaPhim = Number(req.params.filmId)
      if (Number.isNaN(MaPhim)) {
        return res.status(400).json({ message: 'MaPhim không hợp lệ' })
      }
      const lichChieus = await lichChieu_Services.getByFilmId_Service(MaPhim)
      res.status(200).json(lichChieus)
    } catch (error) {
      next(error)
    }
  },

  create: async (req, res, next) => {
    try {
      const dto = CreateLichChieuDTO.fromRequest(req.body)
      const insertId = await lichChieu_Services.create_Service(dto.toObject())
      res.status(201).json({ insertId })
    } catch (error) {
      next(error)
    }
  },

  update: async (req, res, next) => {
    try {
      const MaLich = Number(req.params.id)
      if (Number.isNaN(MaLich)) {
        return res.status(400).json({ message: 'MaLich không hợp lệ' })
      }
      const dto = CreateLichChieuDTO.fromRequest(req.body)
      const affectedRows = await lichChieu_Services.update_Service(MaLich, dto.toObject())
      res.status(200).json({ message: 'Cập nhật thành công' })
    } catch (error) {
      next(error)
    }
  },

  delete: async (req, res, next) => {
    try {
      const MaLich = Number(req.params.id)
      if (Number.isNaN(MaLich)) {
        return res.status(400).json({ message: 'MaLich không hợp lệ' })
      }
      await lichChieu_Services.delete_Service(MaLich)
      res.status(200).json({ message: 'Xóa thành công' })
    } catch (error) {
      next(error)
    }
  },

  getBookedSeats: async (req, res, next) => {
    try {
      const MaLich = Number(req.params.id)
      if (Number.isNaN(MaLich)) {
        return res.status(400).json({ message: 'MaLich không hợp lệ' })
      }
      const seats = await lichChieu_Services.getBookedSeats_Service(MaLich)
      res.status(200).json({ bookedSeats: seats })
    } catch (error) {
      next(error)
    }
  },
}
