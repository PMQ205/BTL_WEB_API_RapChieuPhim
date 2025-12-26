// Sources/dtos/User/update_user.dto.js
import { updateUser_Validator } from "../../validators/User/update_User_validator.js";

export class UpdateUserDTO {
  constructor(data) {
    // Chỉ set những field được gửi lên tương tự update_Film.dto.js
    if (data.TenKH !== undefined)   this.TenKH   = data.TenKH;
    if (data.NgaySinh !== undefined) this.NgaySinh = data.NgaySinh;
    if (data.DiaChi !== undefined)   this.DiaChi   = data.DiaChi;
    if (data.SoCMND !== undefined)   this.SoCMND   = data.SoCMND;
    if (data.SDT !== undefined)      this.SDT      = data.SDT;
    if (data.Email !== undefined)    this.Email    = data.Email;
    if (data.MatKhau !== undefined)  this.MatKhau  = data.MatKhau;
  }

  toUpdateObject() {
    const obj = {};
    if (this.TenKH   !== undefined) obj.TenKH   = this.TenKH;
    if (this.NgaySinh !== undefined) obj.NgaySinh = this.NgaySinh;
    if (this.DiaChi   !== undefined) obj.DiaChi   = this.DiaChi;
    if (this.SoCMND   !== undefined) obj.SoCMND   = this.SoCMND;
    if (this.SDT      !== undefined) obj.SDT      = this.SDT;
    if (this.Email    !== undefined) obj.Email    = this.Email;
    if (this.MatKhau  !== undefined) obj.MatKhau  = this.MatKhau;
    return obj;
  }

  static fromRequest(body) {
    const validData = updateUser_Validator(body);
    return new UpdateUserDTO(validData);
  }
}