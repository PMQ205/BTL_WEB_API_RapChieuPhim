create database RAPCHIEUPHIM;
use RAPCHIEUPHIM;

-- drop database RAPCHIEUPHIM

-- Bảng Phim
CREATE TABLE PHIM (
    MaPhim INT AUTO_INCREMENT PRIMARY KEY,
    TenPhim VARCHAR(255),
    TheLoai VARCHAR(255),
    TomTat TEXT,
    Trailer VARCHAR(255),
    ThoiLuong INT,
    DaoDien VARCHAR(255),
    DienVien TEXT
);
-- ALTER TABLE PHIM ADD COLUMN TrangThai INT DEFAULT 1;
-- ALTER TABLE PHIM ADD COLUMN HinhAnh VARCHAR(255);

-- Bảng Phòng chiếu
CREATE TABLE PHONGCHIEU (
    MaPhong INT AUTO_INCREMENT PRIMARY KEY,
    TenPhong VARCHAR(50),
    SucChua INT
);

-- Bảng Lịch chiếu
CREATE TABLE LICHCHIEU (
    MaLich INT AUTO_INCREMENT PRIMARY KEY,
    MaPhim INT,
    MaPhong INT,
    GioChieu DATETIME,
    GiaVe DECIMAL(10,2),
    FOREIGN KEY (MaPhim) REFERENCES PHIM(MaPhim),
    FOREIGN KEY (MaPhong) REFERENCES PHONGCHIEU(MaPhong)
);

-- Bảng Khách hàng
CREATE TABLE KHACHHANG (
    MaKH INT AUTO_INCREMENT PRIMARY KEY,
    TenKH VARCHAR(255),
    NgaySinh DATE,
    DiaChi VARCHAR(255),
    SoCMND VARCHAR(20),
    SDT VARCHAR(20),
    Email VARCHAR(100),
    TenDangNhap VARCHAR(50),
    MatKhau VARCHAR(255)
);

-- Bảng Vé
CREATE TABLE VE (
    MaVe INT AUTO_INCREMENT PRIMARY KEY,
    MaKH INT,
    MaLich INT,
    GheNgoi VARCHAR(10),
    NgayMua DATETIME,
    FOREIGN KEY (MaKH) REFERENCES KHACHHANG(MaKH),
    FOREIGN KEY (MaLich) REFERENCES LICHCHIEU(MaLich)
);

select * from PHIM;
INSERT INTO PHIM (TenPhim, TheLoai, TomTat, Trailer, ThoiLuong, DaoDien, DienVien)
VALUES
('Avengers: Endgame', 'Hành động, Viễn tưởng', 'Biệt đội Avengers đối đầu Thanos.', 'https://youtu.be/TcMBFSGVi1c', 181, 'Anthony Russo, Joe Russo', 'Chris Evans, Robert Downey Jr., Chris Hemsworth'),
('Avatar 2', 'Phiêu lưu, Viễn tưởng', 'Tiếp nối hành trình của Jake và Neytiri.', 'https://youtu.be/d9MyW72ELq0', 192, 'James Cameron', 'Sam Worthington, Zoe Saldana'),
('Lật Mặt 6', 'Hài, Hành động', 'Một chuyến du lịch đầy drama và bí ẩn.', 'https://youtu.be/abc123', 130, 'Lý Hải', 'Huy Khánh, Trung Dũng'),
('Conan: The Movie 26', 'Hoạt hình, Trinh thám', 'Conan phá án liên quan đến tổ chức Áo đen.', 'https://youtu.be/def456', 110, 'Yuzuru Tachikawa', 'Minami Takayama'),
('The Nun 2', 'Kinh dị', 'Ác quỷ Valak trở lại gieo rắc nỗi sợ hãi.', 'https://youtu.be/ghi789', 105, 'Michael Chaves', 'Taissa Farmiga');

INSERT INTO PHONGCHIEU (TenPhong, SucChua)
VALUES
('Phòng 1', 120),
('Phòng 2', 150),
('Phòng 3', 100),
('Phòng 4', 200);

INSERT INTO LICHCHIEU (MaPhim, MaPhong, GioChieu, GiaVe)
VALUES
(1, 1, '2025-12-12 18:00:00', 90000),
(1, 2, '2025-12-12 20:30:00', 100000),
(2, 3, '2025-12-13 14:00:00', 95000),
(3, 4, '2025-12-12 19:00:00', 85000),
(4, 2, '2025-12-14 16:30:00', 75000),
(5, 1, '2025-12-15 21:00:00', 90000);


INSERT INTO KHACHHANG (TenKH, NgaySinh, DiaChi, SoCMND, SDT, Email, TenDangNhap, MatKhau)
VALUES
('Nguyễn Văn A', '2000-05-20', 'Hà Nội', '012345678', '0901234567', 'vana@example.com', 'vana', '123456'),
('Trần Thị B', '1999-10-12', 'Hồ Chí Minh', '123456789', '0939876543', 'thib@example.com', 'thib', '123456'),
('Lê Văn C', '1998-03-15', 'Đà Nẵng', '987654321', '0912345678', 'vanc@example.com', 'vanc', '123456');

INSERT INTO VE (MaKH, MaLich, GheNgoi, NgayMua)
VALUES
(1, 1, 'A05', NOW()),
(1, 2, 'B10', NOW()),
(2, 3, 'C12', NOW()),
(2, 4, 'D03', NOW()),
(3, 5, 'E01', NOW());

select * from phim