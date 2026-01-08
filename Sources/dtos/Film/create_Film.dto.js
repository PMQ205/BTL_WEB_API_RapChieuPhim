// Sources/dtos/Film/create_Film.dto.js
import { createFilm_Validator } from "../../validators/Film/create_Film_validator.js";

export class createFilm_DTO {
  constructor(data) {
    this.TenPhim   = data.TenPhim;
    this.TheLoai   = data.TheLoai;
    this.TomTat    = data.TomTat ?? null;
    this.Trailer   = data.Trailer ?? null;
    this.ThoiLuong = data.ThoiLuong;
    this.DaoDien   = data.DaoDien;
    this.DienVien  = data.DienVien;
    this.Anh       = data.Anh;
    this.Loai      = data.Loai;
  }

  toObject() {
    return {
      TenPhim: this.TenPhim,
      TheLoai: this.TheLoai,
      TomTat: this.TomTat,
      Trailer: this.Trailer,
      ThoiLuong: this.ThoiLuong,
      DaoDien: this.DaoDien,
      DienVien: this.DienVien,
      Anh: this.Anh,
      Loai: this.Loai,
    };
  }

  static fromRequest(body) {
    const validData = createFilm_Validator(body);
    return new createFilm_DTO(validData);
  }
}
