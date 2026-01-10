import { FilmDTO } from '../../dtos/Film/film.dto.js'
import { films_Repo } from '../../repositories/Film_repo.js'
import { logger } from '../../config/logger.js'

export const film_Services = {
  getAllFilms_Service: async () => {
    try {
      const films = await films_Repo.getAllFilms_Repo()
      logger.info('Dịch vụ: Lấy tất cả films')
      return films.map((film) => new FilmDTO(film))
    } catch (error) {
      logger.error('Dịch vụ: Lỗi lấy tất cả films', error)
      throw error
    }
  },

  getFilmsByID_Service: async (MaPhim) => {
    try {
      const films = await films_Repo.getFilmsByID_Repo(MaPhim)
      logger.info(`Dịch vụ: Lấy film với MaPhim: ${MaPhim}`)
      return films.map((film) => new FilmDTO(film))
    } catch (error) {
      logger.error(`Dịch vụ: Lỗi lấy film với MaPhim: ${MaPhim}`, error)
      throw error
    }
  },

  addFilm_Service: async (filmData) => {
    try {
      const insertId = await films_Repo.addFilm_Repo(filmData)
      logger.info(`Dịch vụ: Thêm film mới với MaPhim: ${insertId}`)
      return insertId
    } catch (error) {
      logger.error('Dịch vụ: Lỗi thêm film mới', error)
      throw error
    }
  },

  updateFilm_Service: async (id, filmData) => {
    try {
      const affectedRows = await films_Repo.updateFilm_Repo(id, filmData)
      logger.info(`Dịch vụ: Cập nhật film với ID: ${id}`)
      return affectedRows
    } catch (error) {
      logger.error(`Dịch vụ: Lỗi cập nhật film với ID: ${id}`, error)
      throw error
    }
  },

  deleteFilm_Service: async (id) => {
    const hasLichChieu = await films_Repo.hasLichChieu_Repo(id)

    if (hasLichChieu) {
      const error = new Error('Phim đã có lịch chiếu, không thể xóa')
      error.status = 409
      throw error
    }

    return await films_Repo.deleteFilm_Repo(id)
  },

  getFilmsByLoai_Service: async (Loai) => {
    try {
      const films = await films_Repo.getFilmsByLoai_Repo(Loai)
      logger.info(`Dịch vụ: Lấy films theo Loai: ${Loai}`)
      return films.map((film) => new FilmDTO(film))
    } catch (error) {
      logger.error(`Dịch vụ: Lỗi lấy films theo Loai: ${Loai}`, error)
      throw error
    }
  },

  getFeaturedFilms_Service: async (Loai, limit = 6) => {
    try {
      const films = await films_Repo.getFeaturedFilms_Repo(Loai, limit)
      logger.info(`Dịch vụ: Lấy ${limit} featured films theo Loai: ${Loai}`)
      return films.map((film) => new FilmDTO(film))
    } catch (error) {
      logger.error(`Dịch vụ: Lỗi lấy ${limit} featured films theo Loai: ${Loai}`, error)
      throw error
    }
  },
}
