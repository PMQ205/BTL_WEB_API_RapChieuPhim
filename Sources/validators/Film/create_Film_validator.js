import { z } from 'zod';

export const create_Films_Validator = z.object({
  TenPhim: z.string()
    .trim()
    .regex(/^[^<>]*$/, "Không được chứa ký tự < >")
    .min(1, { message: "Tên phim không được để trống" })
    .max(255, { message: "Tên phim không được vượt quá 255 ký tự" }),

  TheLoai: z.string()
    .trim()
    .regex(/^[^<>]*$/, "Không được chứa ký tự < >")
    .min(1)
    .max(255)
    .regex(/^[\p{L}\s,]+$/u, "Thể loại chỉ được chứa chữ cái, khoảng trắng và dấu phẩy"),

  TomTat: z.string()
    .trim()
    .regex(/^[^<>]*$/, "Không được chứa ký tự < >")
    .min(1, { message: "Tóm tắt không được để trống" })
    .optional(),

  Trailer: z.string()
    .trim()
    .regex(/^[^<>]*$/, "Không được chứa ký tự < >")
    .max(255)
    .optional(),

  ThoiLuong: z.coerce.number()
    .int()
    .min(1, { message: "Thời lượng phải là số nguyên dương và > 0" }),

  DaoDien: z.string()
    .trim()
    .regex(/^[^<>]*$/, "Không được chứa ký tự < >")
    .min(1)
    .max(255)
    .regex(/^[\p{L}\s]+$/u, "Tên đạo diễn chỉ được chứa chữ và khoảng trắng"),

  DienVien: z.string()
    .trim()
    .regex(/^[^<>]*$/, "Không được chứa ký tự < >")
    .min(1)
    .max(255)
    .regex(/^[\p{L}\s,]+$/u, "Tên diễn viên chỉ được chứa chữ, khoảng trắng và dấu phẩy"),
    
  Anh: z.string()
  .trim()
  .min(1)
})
.strict();



export function createFilm_Validator(data) {
  return create_Films_Validator.parse(data);
}

export const createFilmArray_Varlidator = z.array(create_Films_Validator); // Mảng các Film
export function validateCreateFilmArray(data) {
    return createFilmArray_Varlidator.parse(data);
  }