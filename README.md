npm install express mysql2 cors // install to run sql
npm install mysql2
npm install compression
npm install helmet
npm install zod

// run by node server.js

if the kidnapper forced you to eat shit to save me
what will you do ??????????????
###
const db = await pool
Ở đây pool là một Promise, không phải là object ngay lập tức.
Muốn lấy được object pool thật (để query) bạn phải chờ promise hoàn thành → dùng await.
###
xóa file .prettienrrc và eslint.config.mjs nếu không tải 2 app này 
### Hướng code 

1) invalidators 
        Nhiệm vụ:

        Kiểm tra dữ liệu đầu vào từ client có hợp lệ không

        Check kiểu dữ liệu (string, number, email…)

        Check rule đơn giản (min length, max, optional…)

        Trả lỗi nếu sai
2) dto (Data Transfer Object)
        Chuẩn hóa dữ liệu sau khi validator kiểm tra xong

        Convert type (string → number)
                vd:
                        this.TenHang = TenHang.trim();
                        this.DonGia = Number(DonGia);
        Trim string

        Loại bỏ field nguy hiểm

        Đảm bảo dữ liệu đi xuống service sạch và chuẩn

        Định nghĩa cấu trúc dữ liệu cố định
3) repository
        lớp làm việc với DATABASE, gồm các hàm truy vấn SQL: findAll, findById, create,  update, delete
        Nhiệm vụ:
        Viết SQL hoặc gọi ORM
        Chỉ thao tác 1 bảng hoặc 1 mục dữ liệu
        => Repository = nơi chứa các hàm truy vấn DB
        
4) services
        Gọi các hàm bên repository
        Thêm nghiệp vụ (logic) 
                vd 
                if (dto.SoLuong <= 0) throw new Error("Số lượng phải > 0");
        Kiểm tra tồn tại
                vd
                const exist = await hangHoaRepository.findByName(dto.TenHang);
                if (exist) throw new Error("Tên hàng đã tồn tại");
        Kiểm tra trùng dữ liệu

        Tính toán
        Xử lý nhiều bảng
        Gọi API bên ngoài
        Transaction (quan trọng nhất)
        Format dữ liệu trả về

5) controller
        Controller là lớp trung gian giữa Router và Service,
        Controller nhận: req.params, req.query, req.body, req.headers, req.files …
        Controller gọi validator để kiểm tra dữ liệu chứ không tự kiểm tra
        Tạo DTO từ dữ liệu đã validate
        Nhận request → Validate + DTO → Gọi service → Trả response
6) routers