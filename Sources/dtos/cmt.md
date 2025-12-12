
###
cấu trúc của class trong js
class TenClass {
  // Phương thức khởi tạo
  constructor(thamSo1, thamSo2) {
    // Gán các tham số làm thuộc tính cho đối tượng
    this.thuocTinh1 = thamSo1;
    this.thuocTinh2 = thamSo2;
  }
  // ... các phương thức khác
}
###

vi du
import { validateCreateGoods } from "../../validators/hanghoa/create-hanghoa.validator.js";

 import { CreateHangHoaDTO } from "../../dtos/hanghoa/create-hanghoa.dto.js";

###
 // Zod check , kiểm tra dữ liệu đầu vào 
  const data = validateCreateGoods(req.body);
###
###
  const dto = new CreateHangHoaDTO(data);
  // CreateHangHoaDTO là một class mô tả rõ các trường bạn cho phép khi tạo hàng hóa
  // DTO sẽ chỉ lấy đúng các trường bạn định nghĩa → tránh hack dữ liệu.
  //Trong DTO bạn có thể convert format dữ liệu:

Chuyển string → number
vd
this.DonGia = Number(DonGia);
this.SoLuong = parseInt(SoLuong);

###
Format ngày tháng
vd client gửi : "NgayNhap": "2025-12-02"
trong dto convert đúng kiểu : this.NgayNhap = new Date(NgayNhap);
###
chuẩn hóa viết hoa
this.Email = Email.toLowerCase();
this.MaHang = MaHang.toUpperCase();
###
tạo giá trị mặc định nếu người dùng không gửi
this.CreatedAt = new Date();
this.Status = Status ?? "PENDING";
###
Trim text
this.TenHang = TenHang.trim();
###
Chỉ lấy dữ liệu cần 
bóc tách dữ liệu bằng  cách ?
        const {trường 1, trường 2, trường 3,...} = data;
 ví dụ 
        const { TenHang, DonGia, SoLuong } = data; // chỉ lấy TenHang, DonGia, SoLuong
trong khi data có :
        const data = {
        TenHang: "iPhone 15",
        DonGia: 30000000,
        SoLuong: 10,
        // --- Các trường KHÔNG AN TOÀN / RÁC ---
        MaHang: "SP001", // Hacker cố tình đổi ID sản phẩm? (Nguy hiểm)
        NgayTao: "2020-01-01", // Hacker cố tình sửa ngày tạo?
        IsAdmin: true, // Hacker cố tình chèn quyền admin?
        MaliciousScript: "<script>alert('hack')</script>" // Mã độc
        };
###
bóc tách các giá trị tiền tệ nếu gửi dấu phẩy
ví dụ người dùng gửi : "200.000" → 200000
thì xử lý :
    this.DonGia = Number(DonGia.toString().replace(/\D/g, ""));

#######################################################################################################
 // chuẩn hóa await hanghoaService.create(dto);