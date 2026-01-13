import { gioHangDv_Services } from '../Services/DichVu/GioHangDv_services.js'

export const gioHangDv_Controller = {
  // Thêm vào giỏ
  add: async (req, res) => {
    try {
      const { MaDV, SoLuong = 1 } = req.body
      const MaKH = req.user.MaKH || req.user.id

      await gioHangDv_Services.add_Service({ MaKH, MaDV, SoLuong })
      res.json({ message: 'Đã thêm vào giỏ hàng!' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Lỗi thêm giỏ hàng' })
    }
  },

  // Lấy giỏ của user
  getMyCart: async (req, res) => {
    try {
      const MaKH = req.user.MaKH || req.user.id
      const data = await gioHangDv_Services.getByUser_Service(MaKH)
      res.json(data)
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Lỗi lấy giỏ hàng' })
    }
  },

  // Xóa 1 món
  removeOne: async (req, res) => {
    try {
      const MaKH = req.user.MaKH || req.user.id
      const { id } = req.params // MaDV

      await gioHangDv_Services.remove_Service(MaKH, id)
      res.json({ message: 'Đã xóa dịch vụ khỏi giỏ' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Lỗi xóa dịch vụ' })
    }
  },

  //  Cập nhật số lượng
  updateQty: async (req, res) => {
    try {
      const { MaDV, SoLuong } = req.body
      const MaKH = req.user.MaKH || req.user.id

      await gioHangDv_Services.updateQty_Service(MaKH, MaDV, SoLuong)
      res.json({ message: 'Đã cập nhật số lượng!' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Lỗi cập nhật số lượng' })
    }
  },

  //  Xóa hết giỏ
  clearAll: async (req, res) => {
    try {
      const MaKH = req.user.MaKH || req.user.id

      await gioHangDv_Services.clearByUser_Service(MaKH)
      res.json({ message: 'Đã xóa toàn bộ giỏ hàng!' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ message: 'Lỗi xóa giỏ hàng' })
    }
  }
}
