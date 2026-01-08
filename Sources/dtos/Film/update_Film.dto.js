// Sources/dtos/Film/update_Film.dto.js
import { updateFilm_Varlidator } from "../../validators/Film/update_Film_validator.js";

export class updateFilmDTO {
  constructor(data) {
    this.MaPhim = data.MaPhim;

    // chỉ set những field được gửi lên (update partial)
    if (data.TenPhim   !== undefined)   this.TenPhim   = data.TenPhim;
    if (data.TheLoai   !== undefined)   this.TheLoai   = data.TheLoai;
    if (data.TomTat    !== undefined)   this.TomTat    = data.TomTat;
    if (data.Trailer   !== undefined)   this.Trailer   = data.Trailer;
    if (data.ThoiLuong !== undefined)   this.ThoiLuong = data.ThoiLuong;
    if (data.DaoDien   !== undefined)   this.DaoDien   = data.DaoDien;
    if (data.DienVien  !== undefined)   this.DienVien  = data.DienVien;
    if (data.Anh       !== undefined)   this.Anh       = data.Anh;
    if (data.Loai      !== undefined)   this.Loai      = data.Loai;
  }

  toUpdateObject() {
    const obj = {};
    if (this.TenPhim   !== undefined) obj.TenPhim   = this.TenPhim;
    if (this.TheLoai   !== undefined) obj.TheLoai   = this.TheLoai;
    if (this.TomTat    !== undefined) obj.TomTat    = this.TomTat;
    if (this.Trailer   !== undefined) obj.Trailer   = this.Trailer;
    if (this.ThoiLuong !== undefined) obj.ThoiLuong = this.ThoiLuong;
    if (this.DaoDien   !== undefined) obj.DaoDien   = this.DaoDien;
    if (this.DienVien  !== undefined) obj.DienVien  = this.DienVien;
    if (this.Anh       !== undefined) obj.Anh       = this.Anh;
    if (this.Loai      !== undefined) obj.Loai      = this.Loai;
    return obj;
  }

  static fromRequest(body) {
    const validData = updateFilm_Varlidator(body);
    return new updateFilmDTO(validData);
  }
}
