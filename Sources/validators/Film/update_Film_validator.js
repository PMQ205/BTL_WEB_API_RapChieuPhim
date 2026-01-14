import { z } from "zod";


export const update_Films = z.object({
  MaPhim: z.coerce.number()
    .int()
    .min(1, "Mã phim phải là số nguyên dương"),

  TenPhim: z.string()
    .trim()
    .regex(/^[^<>]*$/, "Không được chứa ký tự < >")
    .min(1)
    .max(255)
    .optional(),

  TheLoai: z.string()
    .trim()
    .regex(/^[^<>]*$/, "Không được chứa ký tự < >")
    .min(1)
    .max(255)
    .regex(/^[\p{L}\s,]+$/u, "Thể loại chỉ được chứa chữ cái, khoảng trắng và dấu phẩy")
    .optional(),

  TomTat: z.string()
    .trim()
    .regex(/^[^<>]*$/, "Không được chứa ký tự < >")
    .min(1)
    .optional(),

  Trailer: z.string()
    .trim()
    .regex(/^[^<>]*$/, "Không được chứa ký tự < >")
    .max(255)
    .optional(),

  ThoiLuong: z.coerce.number()
    .int()
    .min(1, "Thời lượng phải là số nguyên dương và > 0")
    .optional(),

  DaoDien: z.string()
    .trim()
    .regex(/^[^<>]*$/, "Không được chứa ký tự < >")
    .min(1)
    .max(255)
    .regex(/^[\p{L}\s]+$/u, "Tên đạo diễn chỉ được chứa chữ và khoảng trắng")
    .optional(),

  DienVien: z.string()
    .trim()
    .regex(/^[^<>]*$/, "Không được chứa ký tự < >")
    .min(1)
    .max(255)
    .regex(/^[\p{L}\s,]+$/u, "Tên diễn viên chỉ được chứa chữ, khoảng trắng và dấu phẩy")
    .optional(),
})
.strict();


export function updateFilm_Varlidator(data) {
    return update_Films.parse(data);
  }
export const updateFilmArray_Varlidator = z.array(update_Films); // Mảng các Film
export function validateUpdateFilmArray(data) {
    return updateFilmArray_Varlidator.parse(data);
  }  