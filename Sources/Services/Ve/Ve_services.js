import { ve_Repo } from '../../repositories/Ve_repo.js'
import { logger } from '../../config/logger.js'
import { ApiError } from '../../utils/ApiError.js'
import { payment_Repo } from '../../repositories/Payment_repo.js'

export const ve_Services = {
  getAll_Service: async (MaKH = null) => {
    try {
      const ves = await ve_Repo.getAll_Repo(MaKH)
      logger.info(`Dịch vụ: Lấy tất cả vé${MaKH ? ` của khách hàng ${MaKH}` : ''}`)
      return ves
    } catch (error) {
      logger.error('Dịch vụ: Lỗi lấy tất cả vé', error)
      throw error
    }
  },

  getById_Service: async (MaVe) => {
    try {
      const ve = await ve_Repo.getById_Repo(MaVe)
      if (!ve) {
        throw new ApiError('Không tìm thấy vé', 404)
      }
      logger.info(`Dịch vụ: Lấy vé với MaVe: ${MaVe}`)
      return ve
    } catch (error) {
      logger.error(`Dịch vụ: Lỗi lấy vé với MaVe: ${MaVe}`, error)
      throw error
    }
  },

  create_Service: async (tickets) => {
    try {
      if (!Array.isArray(tickets) || tickets.length === 0) {
        throw new ApiError('Danh sách vé không hợp lệ', 400)
      }

      // Validate từng vé
      for (const ticket of tickets) {
        if (!ticket.MaKH || !ticket.MaLich || !ticket.GheNgoi) {
          throw new ApiError('Thông tin vé không đầy đủ (MaKH, MaLich, GheNgoi)', 400)
        }
      }

      const insertIds = await ve_Repo.createMultiple_Repo(tickets)
      logger.info(`Dịch vụ: Tạo ${insertIds.length} vé mới`)
      return insertIds
    } catch (error) {
      logger.error('Dịch vụ: Lỗi tạo vé mới', error)
      throw error
    }
  },

  delete_Service: async (MaVe) => {
    try {
      const affectedRows = await ve_Repo.delete_Repo(MaVe)
      if (affectedRows === 0) {
        throw new ApiError('Không tìm thấy vé', 404)
      }
      logger.info(`Dịch vụ: Xóa vé với MaVe: ${MaVe}`)
      return affectedRows
    } catch (error) {
      logger.error(`Dịch vụ: Lỗi xóa vé với MaVe: ${MaVe}`, error)
      throw error
    }
  },
  
getTicketsWithServices_Service: async (MaKH) => {
  const tickets = await ve_Repo.getAll_Service(MaKH);

  for (const t of tickets) {
    const payment = await payment_Repo.getPaymentByMaGD_Repo(t.MaGD);
    const services = await payment_Repo.getServicesByMaGD_Repo(t.MaGD);
    t.DichVu = services || [];
  }

  return tickets;
}
}
