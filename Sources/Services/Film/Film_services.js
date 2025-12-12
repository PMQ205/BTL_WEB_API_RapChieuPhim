import { FilmDTO } from "../../dtos/Film/film.dto.js";
import { films_Repo } from "../../repositories/Film_repo.js";
import { logger } from "../../config/logger.js";

export const film_Services = {
  getAllFilms_Service: async () => {
    try {
      const films = await films_Repo.getAllFilms_Repo();
      logger.info("Dịch vụ: Lấy tất cả films");
      return films.map(film => new FilmDTO(film));
    } catch (error) {
      logger.error("Dịch vụ: Lỗi lấy tất cả films", error);
      throw error;
    }
  },

  getFilmsByID_Service: async (id) => {
    try {
      const films = await films_Repo.getFilmsByID_Repo(id);
      logger.info(`Dịch vụ: Lấy film với ID: ${id}`);
      return films.map(film => new FilmDTO(film));
    } catch (error) {
      logger.error(`Dịch vụ: Lỗi lấy film với ID: ${id}`, error);
      throw error;
    }
  },

  addFilm_Service: async (filmData) => {
    try {
      const insertId = await films_Repo.addFilm_Repo(filmData);
      logger.info(`Dịch vụ: Thêm film mới với ID: ${insertId}`);
      return insertId;
    } catch (error) {
      logger.error("Dịch vụ: Lỗi thêm film mới", error);
      throw error;
    }
  },

  updateFilm_Service: async (id, filmData) => {
    try {
      const affectedRows = await films_Repo.updateFilm_Repo(id, filmData);
      logger.info(`Dịch vụ: Cập nhật film với ID: ${id}`);
      return affectedRows;
    } catch (error) {
      logger.error(`Dịch vụ: Lỗi cập nhật film với ID: ${id}`, error);
      throw error;
    }
  },

  deleteFilm_Service: async (id) => {
    try {
      const affectedRows = await films_Repo.deleteFilm_Repo(id);
      logger.info(`Dịch vụ: Xóa film với ID: ${id}`);
      return affectedRows;
    } catch (error) {
      logger.error(`Dịch vụ: Lỗi xóa film với ID: ${id}`, error);
      throw error;
    }
  },
};
