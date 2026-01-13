import { gioHangDv_Repo } from '../../repositories/GioHangDv_repo.js'

export const gioHangDv_Services = {
  add_Service: gioHangDv_Repo.add_Repo,
  getByUser_Service: gioHangDv_Repo.getByUser_Repo,
  clearByUser_Service: gioHangDv_Repo.clear_Repo,
  removeOne_Service: gioHangDv_Repo.removeOne_Repo,
  updateQty_Service: gioHangDv_Repo.updateQty_Repo
}
