import { ve_Services } from '../Services/Ve/Ve_services.js'
import { logger } from '../config/logger.js'

export const ve_Controller = {
  getAll: async (req, res, next) => {
    try {
      // Nếu là admin/staff, lấy tất cả. Nếu là customer, chỉ lấy của mình
      const userId = req.user?.MaKH || req.user?.id;
      const MaKH =
        req.user && (req.user.role === 1 || req.user.role === 2)
          ? null
          : userId ? userId : null
      const ves = await ve_Services.getAll_Service(MaKH)
      res.status(200).json(ves)
    } catch (error) {
      next(error)
    }
  },

  getById: async (req, res, next) => {
    try {
      const MaVe = Number(req.params.id)
      if (Number.isNaN(MaVe)) {
        return res.status(400).json({ message: 'MaVe không hợp lệ' })
      }
      const ve = await ve_Services.getById_Service(MaVe)

      // Kiểm tra quyền: customer chỉ xem được vé của mình
      const userId = req.user?.MaKH || req.user?.id;
      if (req.user && req.user.role === 3 && ve.MaKH !== userId) {
        return res.status(403).json({ message: 'Không có quyền truy cập' })
      }

      res.status(200).json(ve)
    } catch (error) {
      next(error)
    }
  },

  create: async (req, res, next) => {
    try {
      if (!req.user) {
        return res.redirect('/login');
      }

      // DEBUG: log req.user để kiểm tra OAuth
      console.log('DEBUG Ve_Controller create - req.user:', { 
        MaKH: req.user.MaKH, 
        id: req.user.id,
        TenKH: req.user.TenKH,
        Email: req.user.Email,
        provider: req.user.provider,
        allKeys: Object.keys(req.user)
      });

      // Lấy MaKH từ req.user.MaKH (OAuth/DB) hoặc req.user.id (fallback)
      const MaKH = req.user.MaKH || req.user.id;
      if (!MaKH) {
        console.error('ERROR Ve_Controller: MaKH không được lấy từ req.user');
        return res.status(400).json({ message: 'Không lấy được mã khách hàng' })
      }

      console.log('DEBUG Ve_Controller: MaKH =', MaKH);

      const tickets = Array.isArray(req.body) ? req.body : [req.body]
      const insertIds = await ve_Services.create_Service(
        tickets.map((ticket) => ({
          MaKH: MaKH,
          MaLich: ticket.MaLich,
          GheNgoi: ticket.GheNgoi,
        }))
      )

      res.status(201).json({ insertIds, message: 'Đặt vé thành công' })
    } catch (error) {
      next(error)
    }
  },

  delete: async (req, res, next) => {
    try {
      const MaVe = Number(req.params.id)
      if (Number.isNaN(MaVe)) {
        return res.status(400).json({ message: 'MaVe không hợp lệ' })
      }

      // Kiểm tra quyền: customer chỉ xóa được vé của mình
      if (req.user && req.user.role === 3) {
        const ve = await ve_Services.getById_Service(MaVe)
        const userId = req.user.MaKH || req.user.id;
        if (ve.MaKH !== userId) {
          return res.status(403).json({ message: 'Không có quyền xóa vé này' })
        }
      }

      await ve_Services.delete_Service(MaVe)
      res.status(200).json({ message: 'Xóa vé thành công' })
    } catch (error) {
      next(error)
    }
  },
}
