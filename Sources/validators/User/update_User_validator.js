import { z } from 'zod';

// Validator cho việc tạo mới người dùng
export const update_Users_Validator = z.object({
  MaKH: z.coerce.number()
    .int()
    .min(1, "Mã khách hàng phải là số nguyên dương"),

  TenKH: z.string()
    .trim()
    .min(1, { message: "Tên khách hàng không được để trống" })
    .max(255),
  
  NgaySinh: z.coerce.date({
    errorMap: () => ({ message: "Ngày sinh không đúng định dạng (YYYY-MM-DD)" })
  }).optional(),
  
  DiaChi: z.string().trim().max(255).optional(),
  
  SoCMND: z.string()
    .trim()
    .regex(/^[0-9]{9,12}$/, "Số CMND/CCCD phải từ 9-12 chữ số")
    .optional(),
  
  SDT: z.string()
    .trim()
    .regex(/^(0|84)[0-9]{9}$/, "Số điện thoại không hợp lệ (phải có 10 số)"),
  
  Email: z.string()
    .trim()
    .email({ message: "Email không đúng định dạng" })
    .max(100),
  
  TenDangNhap: z.string()
    .trim()
    .min(5, { message: "Tên đăng nhập phải có ít nhất 5 ký tự" })
    .max(50),
  
  MatKhau: z.string()
    .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
});

export function updateUser_Validator(data) {
  return update_Users_Validator.parse(data);
}