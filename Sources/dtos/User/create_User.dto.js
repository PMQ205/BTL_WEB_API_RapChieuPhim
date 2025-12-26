// Sources/dtos/User/create_user.dto.js
import { createUser_Validator } from "../../validators/User/create_User_validator.js";

export class CreateUserDTO {
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

  toObject() {
    return {
      TenKH: this.TenKH,
      NgaySinh: this.NgaySinh,
      DiaChi: this.DiaChi,
      SoCMND: this.SoCMND,
      SDT: this.SDT,
      Email: this.Email,
      TenDangNhap: this.TenDangNhap,
      MatKhau: this.MatKhau,
    };
  }

  static fromRequest(body) {
    const validData = createUser_Validator(body);
    return new CreateUserDTO(validData);
  }
}