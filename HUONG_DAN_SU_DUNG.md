# Hướng Dẫn Sử Dụng Hệ Thống Quản Lý Rạp Chiếu Phim

## Vấn đề: Click vào phim không đi đến trang chi tiết

### Nguyên nhân:

1. Database chưa có dữ liệu hoặc các phim không có cột `Loai`
2. Khi không có dữ liệu từ database, các phim mặc định không có `MaPhim` nên link sẽ là `#`

### Giải pháp:

#### Bước 1: Chạy script SQL để thêm dữ liệu mẫu

Chạy file `database_sample_data.sql` trong MySQL để:

- Thêm phòng chiếu
- Cập nhật các phim có sẵn với cột `Loai` (MOVIE, SERIES, CARTOON)
- Thêm lịch chiếu mẫu

#### Bước 2: Kiểm tra dữ liệu

Truy cập: `http://localhost:3000/debug/films` để xem:

- Tổng số phim
- Số lượng phim theo từng loại (MOVIE, SERIES, CARTOON)
- Mẫu dữ liệu phim

#### Bước 3: Cập nhật database thủ công (nếu cần)

Nếu các phim trong database chưa có cột `Loai`, chạy:

```sql
-- Cập nhật tất cả phim thành MOVIE (hoặc thay đổi theo ý muốn)
UPDATE PHIM SET Loai = 'MOVIE' WHERE Loai IS NULL OR Loai = '';

-- Hoặc cập nhật từng phim cụ thể
UPDATE PHIM SET Loai = 'MOVIE' WHERE TenPhim = 'Bat-man';
UPDATE PHIM SET Loai = 'SERIES' WHERE TenPhim = 'Supergirl';
UPDATE PHIM SET Loai = 'CARTOON' WHERE TenPhim = 'Demon Slayer';
```

## Các Route Chính:

### Views (Frontend):

- `GET /` - Trang chủ
- `GET /login` - Đăng nhập
- `GET /register` - Đăng ký
- `GET /film/:id` - Chi tiết phim (cần có MaPhim trong database)
- `GET /showtimes/:id` - Chọn ghế đặt vé (cần có MaLich)
- `GET /tickets` - Vé của tôi (cần đăng nhập)

### API:

- `GET /api/films` - Lấy tất cả phim
- `GET /api/films/:id` - Lấy phim theo ID
- `GET /api/lichchieu` - Lấy tất cả lịch chiếu
- `GET /api/lichchieu/film/:filmId` - Lấy lịch chiếu theo phim
- `GET /api/lichchieu/:id/seats` - Lấy ghế đã đặt
- `POST /api/ve` - Đặt vé (cần đăng nhập)
- `GET /api/ve` - Lấy danh sách vé (cần đăng nhập)

### Debug:

- `GET /debug/films` - Kiểm tra dữ liệu phim trong database

## Lưu ý:

1. Đảm bảo tất cả phim trong database có cột `Loai` với giá trị: 'MOVIE', 'SERIES', hoặc 'CARTOON'
2. Đảm bảo tất cả phim có `MaPhim` (tự động tăng khi INSERT)
3. Để test đặt vé, cần có ít nhất 1 lịch chiếu trong bảng LICHCHIEU
