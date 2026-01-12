import { lichChieu_Repo } from '../../repositories/LichChieu_repo.js'
import { logger } from '../../config/logger.js'
import { ApiError } from '../../utils/ApiError.js'
import { giaoDichTmp_Repo } from '../../repositories/GiaoDichTmp_repo.js';
import { ve_Repo } from '../../repositories/Ve_repo.js'

export const lichChieu_Services = {
  getAll_Service: async () => {
    try {
      const lichChieus = await lichChieu_Repo.getAll_Repo()
      logger.info('Dịch vụ: Lấy tất cả lịch chiếu')
      return lichChieus
    } catch (error) {
      logger.error('Dịch vụ: Lỗi lấy tất cả lịch chiếu', error)
      throw error
    }
  },

  getById_Service: async (MaLich) => {
    try {
      const lichChieu = await lichChieu_Repo.getById_Repo(MaLich)
      if (!lichChieu) {
        throw new ApiError('Không tìm thấy lịch chiếu', 404)
      }
      logger.info(`Dịch vụ: Lấy lịch chiếu với MaLich: ${MaLich}`)
      return lichChieu
    } catch (error) {
      logger.error(`Dịch vụ: Lỗi lấy lịch chiếu với MaLich: ${MaLich}`, error)
      throw error
    }
  },

  getByFilmId_Service: async (MaPhim) => {
    try {
      const lichChieus = await lichChieu_Repo.getByFilmId_Repo(MaPhim)
      logger.info(`Dịch vụ: Lấy lịch chiếu theo MaPhim: ${MaPhim}`)
      return lichChieus
    } catch (error) {
      logger.error(`Dịch vụ: Lỗi lấy lịch chiếu theo MaPhim: ${MaPhim}`, error)
      throw error
    }
  },

  create_Service: async (data) => {
    try {
      const insertId = await lichChieu_Repo.create_Repo(data)
      logger.info(`Dịch vụ: Tạo lịch chiếu mới với MaLich: ${insertId}`)
      return insertId
    } catch (error) {
      logger.error('Dịch vụ: Lỗi tạo lịch chiếu mới', error)
      throw error
    }
  },

  update_Service: async (MaLich, data) => {
    try {
      const affectedRows = await lichChieu_Repo.update_Repo(MaLich, data)
      if (affectedRows === 0) {
        throw new ApiError('Không tìm thấy lịch chiếu', 404)
      }
      logger.info(`Dịch vụ: Cập nhật lịch chiếu với MaLich: ${MaLich}`)
      return affectedRows
    } catch (error) {
      logger.error(`Dịch vụ: Lỗi cập nhật lịch chiếu với MaLich: ${MaLich}`, error)
      throw error
    }
  },

  delete_Service: async (MaLich) => {
    try {
      const affectedRows = await lichChieu_Repo.delete_Repo(MaLich)
      if (affectedRows === 0) {
        throw new ApiError('Không tìm thấy lịch chiếu', 404)
      }
      logger.info(`Dịch vụ: Xóa lịch chiếu với MaLich: ${MaLich}`)
      return affectedRows
    } catch (error) {
      logger.error(`Dịch vụ: Lỗi xóa lịch chiếu với MaLich: ${MaLich}`, error)
      throw error
    }
  },

  getBookedSeats_Service: async (MaLich) => {
    try {
      const seats = await lichChieu_Repo.getBookedSeats_Repo(MaLich)
      logger.info(`Dịch vụ: Lấy ghế đã đặt cho lịch chiếu ${MaLich}`)
      return seats
    } catch (error) {
      logger.error(`Dịch vụ: Lỗi lấy ghế đã đặt cho lịch chiếu ${MaLich}`, error)
      throw error
    }
  },
  getPendingSeats_Service: async (MaLich) => {
    const seats = await giaoDichTmp_Repo.getPendingSeats_Repo(MaLich)
    return seats
  },

  // 🔥 GHẾ KHÓA HIỂN THỊ — VE + PENDING
  getAllLockedSeats_Service: async (MaLich) => {
    const booked = await ve_Repo.getBookedSeats_Repo(MaLich)
    const pending = await giaoDichTmp_Repo.getPendingSeats_Repo(MaLich)
    return [...new Set([...booked, ...pending])]
  },
  
}
