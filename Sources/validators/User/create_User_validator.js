import { z } from 'zod';

export const create_Users_Validator = z.object({
  TenKH: z.string().trim().min(1, "Tên không được để trống").max(255),
  NgaySinh: z.coerce.date().optional(),
  DiaChi: z.string().trim().max(255).optional(),
  SoCMND: z.string().trim().regex(/^[0-9]{9,12}$/, "CMND phải từ 9-12 số").optional(),
  SDT: z.string().trim().regex(/^(0|84)[0-9]{9}$/, "SĐT phải có 10 số"),
  Email: z.string().trim().email("Email không đúng định dạng").max(100),
  TenDangNhap: z.string().trim().min(5, "Tên đăng nhập ít nhất 5 ký tự").max(50),
  MatKhau: z.string().min(6, "Mật khẩu ít nhất 6 ký tự")
});

// Sửa hàm parse chính xác
export function createUser_Validator(data) {
  return create_Users_Validator.parse(data);
}