// Sources/dtos/Film/film.dto.js
export class FilmDTO {
    constructor(data) {
      this.MaPhim     = data.MaPhim;
      this.TenPhim    = data.TenPhim;
      this.TheLoai    = data.TheLoai;
      this.TomTat     = data.TomTat;
      this.Trailer    = data.Trailer;
      this.ThoiLuong  = data.ThoiLuong;
      this.DaoDien    = data.DaoDien;
      this.DienVien   = data.DienVien;
      this.Anh        = data.Anh;
      this.Loai       = data.Loai
    }
  }
  