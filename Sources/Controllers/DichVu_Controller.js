import { dichVu_Services } from '../Services/DichVu/DichVu_services.js'

export const dichVu_Controller = {
  getAll: async (req, res) => {
    const data = await dichVu_Services.getAll_Service()
    res.status(200).json(data)
  },
  async getAllView(req, res) {
    try {
      const services = await dichVu_Services.getAll_Service()
      res.render('services', { services })
    } catch 
   {
      res.render('error', { message: 'Không tải được dịch vụ' })
    }
  },
}
