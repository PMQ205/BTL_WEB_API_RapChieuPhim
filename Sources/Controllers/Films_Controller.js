// Sources/Controllers/Films_Controller.js

import { logger } from "../config/logger.js";
import { createFilm_DTO } from "../dtos/Film/create_Film.dto.js";
import { updateFilmDTO } from "../dtos/Film/update_Film.dto.js";
import { film_Services } from "../Services/Film/Film_services.js";

export const films_Controller = {
  // GET /films
  getAllFilms_Controller: async (req, res) => {
    try {
      const films = await film_Services.getAllFilms_Service();
      res.status(200).json(films);
    } catch (error) {
      logger.error("Controller: Lỗi lấy tất cả films", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    } 
  },

  // GET /films/:id
  getFilmsByID_Controller: async (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "maphim không hợp lệ" });
    }

    try {
      const films = await film_Services.getFilmsByID_Service(id);
      res.status(200).json(films);
    } catch (error) {
      logger.error(`Controller: Lỗi lấy film với MaPhim: ${id}`, error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  },

  // POST /films
  addFilm_Controller: async (req, res) => {
    try {
      const filmDTO = createFilm_DTO.fromRequest(req.body);
      const insertId = await film_Services.addFilm_Service(filmDTO.toObject());
      res.status(201).json({ insertId });
    } catch (error) {
      logger.error("Controller: Lỗi thêm film mới", error);
      res.status(500).json({ message: "Lỗi máy chủ" });
    }
  },

  // PUT /films/:id
  updateFilm_Controller: async (req, res) => {
    const id = Number(req.params.id);
  
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "maphim không hợp lệ" });
    }
  
    try {
      const filmDTO = updateFilmDTO.fromRequest({
        ...req.body,
        MaPhim: id,
      });
  
      const affectedRows = await film_Services.updateFilm_Service(
        id,
        filmDTO.toUpdateObject()
      );
  
      if (affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy phim" });
      }
  
      res.status(200).json({ message: "Cập nhật thành công" });
    } catch (error) {
      logger.error(`Controller: Lỗi cập nhật film với MaPhim: ${id}`, error);
      res.status(400).json({
        message: error.errors?.[0]?.message || "Dữ liệu không hợp lệ",
      });
    }
  },
  

  deleteFilm_Controller: async (req, res) => {
    const id = Number(req.params.id);
  
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
  
    try {
      const affectedRows = await film_Services.deleteFilm_Service(id);
  
      if (affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy phim" });
      }
  
      return res.status(200).json({ message: "Xóa phim thành công" });
  
    } 
    catch (error) {
      if (!error.status || error.status >= 500) {
        logger.error(error); // chỉ log lỗi hệ thống
      }
    
      return res.status(error.status || 500).json({
        message: error.message || "Lỗi máy chủ",
      });
    }
    
  },

};
