
export class UserDTO {
  constructor(data) {
    this.TenKH = data.TenKH;
    this.NgaySinh = data.NgaySinh ?? null;
    this.DiaChi = data.DiaChi ?? null;
    this.SoCMND = data.SoCMND ?? null;
    this.SDT = data.SDT;
    this.Email = data.Email;
    this.TenDangNhap = data.TenDangNhap;
    this.MatKhau = data.MatKhau;
  }
}