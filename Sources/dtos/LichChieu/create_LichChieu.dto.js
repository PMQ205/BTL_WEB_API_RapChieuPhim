export class CreateLichChieuDTO {
  constructor(data) {
    this.MaPhim = data.MaPhim
    this.MaPhong = data.MaPhong
    this.GioChieu = data.GioChieu
    this.GiaVe = data.GiaVe
  }

  static fromRequest(body) {
    const dto = new CreateLichChieuDTO(body)

    if (!dto.MaPhim) throw new Error('MaPhim là bắt buộc')
    if (!dto.MaPhong) throw new Error('MaPhong là bắt buộc')
    if (!dto.GioChieu) throw new Error('GioChieu là bắt buộc')
    if (!dto.GiaVe || dto.GiaVe <= 0) throw new Error('GiaVe phải lớn hơn 0')

    return dto
  }

  toObject() {
    return {
      MaPhim: Number(this.MaPhim),
      MaPhong: Number(this.MaPhong),
      GioChieu: this.GioChieu,
      GiaVe: Number(this.GiaVe),
    }
  }
}
