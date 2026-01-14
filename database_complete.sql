-- ============================================
-- DATABASE SCHEMA VÀ DỮ LIỆU MẪU ĐẦY ĐỦ
-- Hệ thống Quản lý Rạp Chiếu Phim
-- ============================================

USE RAPCHIEUPHIM;

-- ============================================
-- XÓA CÁC BẢNG CŨ (NẾU CÓ) - CHỈ CHẠY KHI CẦN RESET
-- ============================================
-- SET FOREIGN_KEY_CHECKS = 0;
-- DROP TABLE IF EXISTS VE;
-- DROP TABLE IF EXISTS LICHCHIEU;
-- DROP TABLE IF EXISTS PHIM;
-- DROP TABLE IF EXISTS PHONGCHIEU;
-- DROP TABLE IF EXISTS KHACHHANG;
-- SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- TẠO CÁC BẢNG
-- ============================================

-- Bảng KHÁCH HÀNG
CREATE TABLE IF NOT EXISTS KHACHHANG (
    MaKH INT AUTO_INCREMENT PRIMARY KEY,
    TenDangNhap VARCHAR(50) UNIQUE NOT NULL,
    MatKhau VARCHAR(255) NOT NULL,
    TenKH VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    SDT VARCHAR(20),
    MaRole INT DEFAULT 3 COMMENT '1=ADMIN, 2=STAFF, 3=USER',
    VaiTro ENUM('USER', 'ADMIN', 'STAFF') DEFAULT 'USER',
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (TenDangNhap),
    INDEX idx_email (Email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng QUYỀN (Permission)
CREATE TABLE IF NOT EXISTS QUYEN (
    MaQuyen INT AUTO_INCREMENT PRIMARY KEY,
    MaCode VARCHAR(50) UNIQUE NOT NULL,        -- ví dụ: USER_MANAGE
    TenQuyen VARCHAR(100) NOT NULL,            -- ví dụ: Phân quyền nhân viên
    MoTa VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng gán quyền cho nhân viên
CREATE TABLE IF NOT EXISTS NHANVIEN_QUYEN (
    MaKH INT NOT NULL,                         -- nhân viên (KHACHHANG.MaKH, MaRole = 2)
    MaQuyen INT NOT NULL,                      -- QUYEN.MaQuyen
    PRIMARY KEY (MaKH, MaQuyen),
    FOREIGN KEY (MaKH) REFERENCES KHACHHANG(MaKH) ON DELETE CASCADE,
    FOREIGN KEY (MaQuyen) REFERENCES QUYEN(MaQuyen) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng PHIM
CREATE TABLE IF NOT EXISTS PHIM (
    MaPhim INT AUTO_INCREMENT PRIMARY KEY,
    TenPhim VARCHAR(200) NOT NULL,
    TheLoai VARCHAR(100),
    TomTat TEXT,
    Trailer VARCHAR(500),
    ThoiLuong INT,
    DaoDien VARCHAR(100),
    DienVien VARCHAR(500),
    Anh VARCHAR(500),
    Loai ENUM('MOVIE', 'SERIES', 'CARTOON') DEFAULT 'MOVIE',
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_loai (Loai),
    INDEX idx_tenphim (TenPhim)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng PHÒNG CHIẾU
CREATE TABLE IF NOT EXISTS PHONGCHIEU (
    MaPhong INT AUTO_INCREMENT PRIMARY KEY,
    TenPhong VARCHAR(50) NOT NULL,
    SucChua INT NOT NULL,
    MoTa TEXT,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_tenphong (TenPhong)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng LỊCH CHIẾU
CREATE TABLE IF NOT EXISTS LICHCHIEU (
    MaLich INT AUTO_INCREMENT PRIMARY KEY,
    MaPhim INT NOT NULL,
    MaPhong INT NOT NULL,
    GioChieu DATETIME NOT NULL,
    GiaVe DECIMAL(10, 2) NOT NULL,
    TrangThai ENUM('ACTIVE', 'CANCELLED', 'COMPLETED') DEFAULT 'ACTIVE',
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (MaPhim) REFERENCES PHIM(MaPhim) ON DELETE CASCADE,
    FOREIGN KEY (MaPhong) REFERENCES PHONGCHIEU(MaPhong) ON DELETE CASCADE,
    INDEX idx_giovieu (GioChieu),
    INDEX idx_maphim (MaPhim),
    INDEX idx_maphong (MaPhong)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng VÉ
CREATE TABLE IF NOT EXISTS VE (
    MaVe INT AUTO_INCREMENT PRIMARY KEY,
    MaKH INT NOT NULL,
    MaLich INT NOT NULL,
    GheNgoi VARCHAR(10) NOT NULL,
    NgayMua DATETIME DEFAULT CURRENT_TIMESTAMP,
    TongTien DECIMAL(10, 2) NOT NULL,
    TrangThai ENUM('ACTIVE', 'CANCELLED', 'USED') DEFAULT 'ACTIVE',
    FOREIGN KEY (MaKH) REFERENCES KHACHHANG(MaKH) ON DELETE CASCADE,
    FOREIGN KEY (MaLich) REFERENCES LICHCHIEU(MaLich) ON DELETE CASCADE,
    UNIQUE KEY unique_ghe_lich (MaLich, GheNgoi),
    INDEX idx_makh (MaKH),
    INDEX idx_malich (MaLich)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERT DỮ LIỆU MẪU
-- ============================================

-- 1. KHÁCH HÀNG
INSERT INTO KHACHHANG (TenDangNhap, MatKhau, TenKH, Email, SDT, MaRole, VaiTro) VALUES
('admin', '$2b$10$TafeJz5vM/.iWj2Oi5q5AexjHSHFiu949O/OkGE8oMhtbAEBghq26', 'Quản trị viên', 'admin@rapchieuphim.com', '0123456789', 1, 'ADMIN'),
('staff1', '$2b$10$TafeJz5vM/.iWj2Oi5q5AexjHSHFiu949O/OkGE8oMhtbAEBghq26', 'Nhân viên 1', 'staff1@rapchieuphim.com', '0987654321', 2, 'STAFF'),
('user1', '$2b$10$TafeJz5vM/.iWj2Oi5q5AexjHSHFiu949O/OkGE8oMhtbAEBghq26', 'Nguyễn Văn A', 'user1@example.com', '0912345678', 3, 'USER'),
('user2', '$2b$10$TafeJz5vM/.iWj2Oi5q5AexjHSHFiu949O/OkGE8oMhtbAEBghq26', 'Trần Thị B', 'user2@example.com', '0923456789', 3, 'USER');

-- Note: Mật khẩu mặc định là "123456" (đã hash bằng bcrypt)
-- Để đăng nhập, sử dụng: username = admin/staff1/user1/user2, password = 123456
-- MaRole: 1=ADMIN, 2=STAFF, 3=USER

-- 2. PHÒNG CHIẾU
INSERT INTO PHONGCHIEU (TenPhong, SucChua, MoTa) VALUES
('Phòng 1', 80, 'Phòng chiếu tiêu chuẩn với màn hình 2D/3D'),
('Phòng 2', 80, 'Phòng chiếu tiêu chuẩn với hệ thống âm thanh Dolby'),
('Phòng 3', 100, 'Phòng chiếu lớn với màn hình IMAX'),
('Phòng 4', 60, 'Phòng chiếu VIP với ghế ngả'),
('Phòng 5', 120, 'Phòng chiếu siêu lớn với công nghệ 4DX');

-- 3. PHIM - MOVIES
INSERT INTO PHIM (TenPhim, TheLoai, TomTat, Trailer, ThoiLuong, DaoDien, DienVien, Anh, Loai) VALUES
('Bat-man', 'Hành động, Siêu anh hùng', 'Cuộc chiến của Người Dơi chống lại tội phạm ở Gotham', 'https://youtube.com/batman', 152, 'Matt Reeves', 'Robert Pattinson, Zoë Kravitz', '/images/movies/bat-man.jpg', 'MOVIE'),
('Blood-shot', 'Hành động, Khoa học viễn tưởng', 'Người lính được hồi sinh với công nghệ nano', 'https://youtube.com/bloodshot', 109, 'Dave Wilson', 'Vin Diesel, Eiza González', '/images/movies/blood-shot.jpg', 'MOVIE'),
('Call', 'Kinh dị, Giật gân', 'Cuộc gọi từ quá khứ thay đổi hiện tại', 'https://youtube.com/call', 112, 'Lee Chung-hyun', 'Park Shin-hye, Jeon Jong-seo', '/images/movies/call.jpg', 'MOVIE'),
('Captain Marvel', 'Hành động, Siêu anh hùng', 'Nguồn gốc của siêu anh hùng mạnh nhất vũ trụ', 'https://youtube.com/captainmarvel', 123, 'Anna Boden, Ryan Fleck', 'Brie Larson, Samuel L. Jackson', '/images/movies/captain-marvel.png', 'MOVIE'),
('End-game', 'Hành động, Siêu anh hùng', 'Trận chiến cuối cùng của Avengers', 'https://youtube.com/endgame', 181, 'Anthony Russo, Joe Russo', 'Robert Downey Jr., Chris Evans', '/images/movies/end-game.jpg', 'MOVIE'),
('Hunter Killer', 'Hành động, Quân sự', 'Thuyền trưởng tàu ngầm giải cứu thế giới', 'https://youtube.com/hunterkiller', 122, 'Donovan Marsh', 'Gerard Butler, Gary Oldman', '/images/movies/hunter-killer.jpg', 'MOVIE'),
('Insidious', 'Kinh dị, Siêu nhiên', 'Gia đình bị ám ảnh bởi linh hồn', 'https://youtube.com/insidious', 103, 'James Wan', 'Patrick Wilson, Rose Byrne', '/images/movies/insidious.jpg', 'MOVIE'),
('Love-Rosie', 'Lãng mạn, Hài', 'Tình bạn đặc biệt giữa Rosie và Alex', 'https://youtube.com/loverosie', 102, 'Christian Ditter', 'Lily Collins, Sam Claflin', '/images/movies/love-roise.jpg', 'MOVIE'),
('Resident Evil', 'Hành động, Kinh dị', 'Cuộc chiến chống lại zombie và Umbrella Corporation', 'https://youtube.com/residentevil', 100, 'Paul W.S. Anderson', 'Milla Jovovich, Michelle Rodriguez', '/images/movies/resident-evil.jpg', 'MOVIE'),
('Theatre Dead', 'Kinh dị, Zombie', 'Rạp chiếu phim bị tấn công bởi zombie', 'https://youtube.com/theatredead', 95, 'Drew Maxwell', 'Various', '/images/movies/theatre-dead.jpg', 'MOVIE'),
('Transformer', 'Hành động, Khoa học viễn tưởng', 'Cuộc chiến giữa Autobots và Decepticons', 'https://youtube.com/transformer', 144, 'Michael Bay', 'Shia LaBeouf, Megan Fox', '/images/movies/transformer.jpg', 'MOVIE'),
('Avengers', 'Hành động, Siêu anh hùng', 'Nhóm siêu anh hùng bảo vệ Trái Đất', 'https://youtube.com/avengers', 143, 'Joss Whedon', 'Robert Downey Jr., Chris Evans', '/images/Avengers .jpeg', 'MOVIE'),
('John Wick', 'Hành động, Tội phạm', 'Sát thủ nghỉ hưu trả thù kẻ đã giết chó của mình', 'https://youtube.com/johnwick', 101, 'Chad Stahelski', 'Keanu Reeves', '/images/John wick.jpg', 'MOVIE'),
('Guardians of the Galaxy Vol 3', 'Hành động, Hài, Khoa học viễn tưởng', 'Cuộc phiêu lưu cuối cùng của nhóm Guardians', 'https://youtube.com/gotg3', 150, 'James Gunn', 'Chris Pratt, Zoe Saldana', '/images/GATG vol3.jpeg', 'MOVIE');

-- 4. PHIM - SERIES
INSERT INTO PHIM (TenPhim, TheLoai, TomTat, Trailer, ThoiLuong, DaoDien, DienVien, Anh, Loai) VALUES
('Supergirl', 'Hành động, Siêu anh hùng', 'Siêu cô gái bảo vệ Trái Đất khỏi các mối đe dọa', 'https://youtube.com/supergirl', 45, 'Greg Berlanti', 'Melissa Benoist, Chyler Leigh', '/images/series/supergirl.jpg', 'SERIES'),
('Stranger Things', 'Khoa học viễn tưởng, Kinh dị', 'Những bí ẩn tại thị trấn nhỏ Hawkins', 'https://youtube.com/strangerthings', 50, 'Duffer Brothers', 'Millie Bobby Brown, Finn Wolfhard', '/images/series/stranger-thing.jpg', 'SERIES'),
('Wanda Vision', 'Siêu anh hùng, Khoa học viễn tưởng', 'Wanda và Vision trong thực tế kỳ lạ', 'https://youtube.com/wandavision', 45, 'Matt Shakman', 'Elizabeth Olsen, Paul Bettany', '/images/series/wanda.png', 'SERIES'),
('The Mandalorian', 'Khoa học viễn tưởng, Hành động', 'Cuộc phiêu lưu của chiến binh Mandalorian', 'https://youtube.com/mandalorian', 40, 'Jon Favreau', 'Pedro Pascal, Gina Carano', '/images/series/mandalorian.jpg', 'SERIES'),
('The Penthouse', 'Drama, Kinh dị', 'Cuộc sống của những cư dân trong tòa nhà sang trọng', 'https://youtube.com/penthouses', 60, 'Joo Dong-min', 'Lee Ji-ah, Kim So-yeon', '/images/series/penthouses.jpg', 'SERIES'),
('Star Trek', 'Khoa học viễn tưởng, Phiêu lưu', 'Cuộc thám hiểm không gian của phi hành đoàn Enterprise', 'https://youtube.com/startrek', 45, 'Gene Roddenberry', 'William Shatner, Leonard Nimoy', '/images/series/star-trek.jpg', 'SERIES'),
('The Falcon and The Winter Soldier', 'Hành động, Siêu anh hùng', 'Cuộc phiêu lưu của Falcon và Winter Soldier', 'https://youtube.com/falconwintersoldier', 50, 'Malcolm Spellman', 'Anthony Mackie, Sebastian Stan', '/images/series/the-falcon.webp', 'SERIES');

-- 5. PHIM - CARTOONS
INSERT INTO PHIM (TenPhim, TheLoai, TomTat, Trailer, ThoiLuong, DaoDien, DienVien, Anh, Loai) VALUES
('Demon Slayer', 'Anime, Hành động', 'Thanh niên trở thành thợ săn quỷ để cứu em gái', 'https://youtube.com/demonslayer', 24, 'Haruo Sotozaki', 'Natsuki Hanae, Akari Kitō', '/images/cartoons/demon-slayer.jpg', 'CARTOON'),
('Your Name', 'Anime, Lãng mạn', 'Hai người lạ đổi thân cho nhau và tìm hiểu về nhau', 'https://youtube.com/yourname', 106, 'Makoto Shinkai', 'Ryunosuke Kamiki, Mone Kamishiraishi', '/images/cartoons/your-name.jpg', 'CARTOON'),
('Coco', 'Hoạt hình, Gia đình', 'Cậu bé khám phá thế giới của tổ tiên trong Ngày của người chết', 'https://youtube.com/coco', 105, 'Lee Unkrich', 'Anthony Gonzalez, Gael García Bernal', '/images/cartoons/coco.jpg', 'CARTOON'),
('The Croods', 'Hoạt hình, Hài, Gia đình', 'Gia đình Crood khám phá thế giới mới', 'https://youtube.com/croods', 98, 'Kirk DeMicco, Chris Sanders', 'Nicolas Cage, Emma Stone', '/images/cartoons/croods.jpg', 'CARTOON'),
('Dragon', 'Hoạt hình, Hành động', 'Cuộc phiêu lưu với rồng và phép thuật', 'https://youtube.com/dragon', 90, 'Dean DeBlois', 'Jay Baruchel, America Ferrera', '/images/cartoons/dragon.jpg', 'CARTOON'),
('Over The Moon', 'Hoạt hình, Gia đình', 'Cô gái trẻ bay lên mặt trăng để tìm thần mặt trăng', 'https://youtube.com/overthemoon', 100, 'Glen Keane', 'Cathy Ang, Phillipa Soo', '/images/cartoons/over-the-moon.jpg', 'CARTOON'),
('Weathering With You', 'Anime, Lãng mạn', 'Cậu bé gặp cô gái có khả năng điều khiển thời tiết', 'https://youtube.com/weathering', 112, 'Makoto Shinkai', 'Kotaro Daigo, Nana Mori', '/images/cartoons/weathering.jpg', 'CARTOON');

-- 6. LỊCH CHIẾU ĐẦY ĐỦ CHO TẤT CẢ PHIM (7 ngày tới)
-- ============================================
-- MOVIES - Lịch chiếu đầy đủ cho tất cả 14 phim MOVIE
-- ============================================

-- Bat-man
INSERT INTO LICHCHIEU (MaPhim, MaPhong, GioChieu, GiaVe, TrangThai) VALUES
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Bat-man' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 14 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Bat-man' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 17 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Bat-man' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 14 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Bat-man' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 20 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Bat-man' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 14 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Bat-man' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 17 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Bat-man' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 20 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Bat-man' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 14 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Bat-man' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 17 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Bat-man' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 20 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Bat-man' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 14 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Bat-man' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 17 HOUR, 80000, 'ACTIVE');

-- Blood-shot
INSERT INTO LICHCHIEU (MaPhim, MaPhong, GioChieu, GiaVe, TrangThai) VALUES
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Blood-shot' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 14 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Blood-shot' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 17 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Blood-shot' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 14 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Blood-shot' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 17 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Blood-shot' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 19 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Blood-shot' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 14 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Blood-shot' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 17 HOUR, 80000, 'ACTIVE');

-- Call
INSERT INTO LICHCHIEU (MaPhim, MaPhong, GioChieu, GiaVe, TrangThai) VALUES
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Call' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 21 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Call' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 21 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Call' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 21 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Call' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 21 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Call' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 22 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Call' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 6 DAY) + INTERVAL 22 HOUR, 80000, 'ACTIVE');

-- Captain Marvel
INSERT INTO LICHCHIEU (MaPhim, MaPhong, GioChieu, GiaVe, TrangThai) VALUES
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Captain Marvel' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 15 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Captain Marvel' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 18 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Captain Marvel' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 14 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Captain Marvel' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 17 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Captain Marvel' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 18 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Captain Marvel' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 16 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Captain Marvel' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 19 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Captain Marvel' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 15 HOUR, 120000, 'ACTIVE');

-- End-game
INSERT INTO LICHCHIEU (MaPhim, MaPhong, GioChieu, GiaVe, TrangThai) VALUES
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'End-game' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 14 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'End-game' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 18 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'End-game' LIMIT 1), 5, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 21 HOUR, 100000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'End-game' LIMIT 1), 5, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 15 HOUR, 100000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'End-game' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 14 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'End-game' LIMIT 1), 5, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 15 HOUR, 100000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'End-game' LIMIT 1), 5, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 19 HOUR, 100000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'End-game' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 18 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'End-game' LIMIT 1), 5, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 21 HOUR, 100000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'End-game' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 16 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'End-game' LIMIT 1), 5, DATE_ADD(NOW(), INTERVAL 6 DAY) + INTERVAL 19 HOUR, 100000, 'ACTIVE');

-- Hunter Killer
INSERT INTO LICHCHIEU (MaPhim, MaPhong, GioChieu, GiaVe, TrangThai) VALUES
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Hunter Killer' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 16 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Hunter Killer' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 19 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Hunter Killer' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 16 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Hunter Killer' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 17 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Hunter Killer' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 20 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Hunter Killer' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 6 DAY) + INTERVAL 18 HOUR, 80000, 'ACTIVE');

-- Insidious
INSERT INTO LICHCHIEU (MaPhim, MaPhong, GioChieu, GiaVe, TrangThai) VALUES
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Insidious' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 22 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Insidious' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 21 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Insidious' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 22 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Insidious' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 22 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Insidious' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 21 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Insidious' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 22 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Insidious' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 6 DAY) + INTERVAL 22 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Insidious' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 7 DAY) + INTERVAL 22 HOUR, 80000, 'ACTIVE');

-- Love-Rosie
INSERT INTO LICHCHIEU (MaPhim, MaPhong, GioChieu, GiaVe, TrangThai) VALUES
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Love-Rosie' LIMIT 1), 4, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 14 HOUR, 150000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Love-Rosie' LIMIT 1), 4, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 16 HOUR, 150000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Love-Rosie' LIMIT 1), 4, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 18 HOUR, 150000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Love-Rosie' LIMIT 1), 4, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 20 HOUR, 150000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Love-Rosie' LIMIT 1), 4, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 18 HOUR, 150000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Love-Rosie' LIMIT 1), 4, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 14 HOUR, 150000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Love-Rosie' LIMIT 1), 4, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 16 HOUR, 150000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Love-Rosie' LIMIT 1), 4, DATE_ADD(NOW(), INTERVAL 6 DAY) + INTERVAL 20 HOUR, 150000, 'ACTIVE');

-- Resident Evil
INSERT INTO LICHCHIEU (MaPhim, MaPhong, GioChieu, GiaVe, TrangThai) VALUES
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Resident Evil' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 20 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Resident Evil' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 22 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Resident Evil' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 20 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Resident Evil' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 22 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Resident Evil' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 21 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Resident Evil' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 6 DAY) + INTERVAL 20 HOUR, 80000, 'ACTIVE');

-- Theatre Dead
INSERT INTO LICHCHIEU (MaPhim, MaPhong, GioChieu, GiaVe, TrangThai) VALUES
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Theatre Dead' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 22 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Theatre Dead' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 22 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Theatre Dead' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 23 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Theatre Dead' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 22 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Theatre Dead' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 6 DAY) + INTERVAL 23 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Theatre Dead' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 7 DAY) + INTERVAL 22 HOUR, 80000, 'ACTIVE');

-- Transformer
INSERT INTO LICHCHIEU (MaPhim, MaPhong, GioChieu, GiaVe, TrangThai) VALUES
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Transformer' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 19 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Transformer' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 14 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Transformer' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 17 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Transformer' LIMIT 1), 4, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 16 HOUR, 150000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Transformer' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 14 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Transformer' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 19 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Transformer' LIMIT 1), 4, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 16 HOUR, 150000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Transformer' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 19 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Transformer' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 6 DAY) + INTERVAL 17 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Transformer' LIMIT 1), 5, DATE_ADD(NOW(), INTERVAL 6 DAY) + INTERVAL 20 HOUR, 100000, 'ACTIVE');

-- Avengers
INSERT INTO LICHCHIEU (MaPhim, MaPhong, GioChieu, GiaVe, TrangThai) VALUES
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Avengers' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 16 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Avengers' LIMIT 1), 5, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 19 HOUR, 100000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Avengers' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 16 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Avengers' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 20 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Avengers' LIMIT 1), 5, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 20 HOUR, 100000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Avengers' LIMIT 1), 5, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 15 HOUR, 100000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Avengers' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 20 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Avengers' LIMIT 1), 5, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 18 HOUR, 100000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Avengers' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 6 DAY) + INTERVAL 16 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Avengers' LIMIT 1), 5, DATE_ADD(NOW(), INTERVAL 7 DAY) + INTERVAL 20 HOUR, 100000, 'ACTIVE');

-- John Wick
INSERT INTO LICHCHIEU (MaPhim, MaPhong, GioChieu, GiaVe, TrangThai) VALUES
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'John Wick' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 20 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'John Wick' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 18 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'John Wick' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 18 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'John Wick' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 20 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'John Wick' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 22 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'John Wick' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 19 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'John Wick' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 20 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'John Wick' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 6 DAY) + INTERVAL 18 HOUR, 80000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'John Wick' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 7 DAY) + INTERVAL 20 HOUR, 80000, 'ACTIVE');

-- Guardians of the Galaxy Vol 3
INSERT INTO LICHCHIEU (MaPhim, MaPhong, GioChieu, GiaVe, TrangThai) VALUES
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Guardians of the Galaxy Vol 3' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 16 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Guardians of the Galaxy Vol 3' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 20 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Guardians of the Galaxy Vol 3' LIMIT 1), 5, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 17 HOUR, 100000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Guardians of the Galaxy Vol 3' LIMIT 1), 5, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 19 HOUR, 100000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Guardians of the Galaxy Vol 3' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 16 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Guardians of the Galaxy Vol 3' LIMIT 1), 5, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 17 HOUR, 100000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Guardians of the Galaxy Vol 3' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 18 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Guardians of the Galaxy Vol 3' LIMIT 1), 5, DATE_ADD(NOW(), INTERVAL 6 DAY) + INTERVAL 16 HOUR, 100000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Guardians of the Galaxy Vol 3' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 7 DAY) + INTERVAL 20 HOUR, 120000, 'ACTIVE');

-- ============================================
-- SERIES - Lịch chiếu đầy đủ cho tất cả 7 phim SERIES
-- ============================================

-- Supergirl
INSERT INTO LICHCHIEU (MaPhim, MaPhong, GioChieu, GiaVe, TrangThai) VALUES
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Supergirl' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 11 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Supergirl' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 11 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Supergirl' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 11 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Supergirl' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 11 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Supergirl' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 11 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Supergirl' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 6 DAY) + INTERVAL 11 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Supergirl' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 7 DAY) + INTERVAL 11 HOUR, 70000, 'ACTIVE');

-- Stranger Things
INSERT INTO LICHCHIEU (MaPhim, MaPhong, GioChieu, GiaVe, TrangThai) VALUES
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Stranger Things' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 10 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Stranger Things' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 10 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Stranger Things' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 10 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Stranger Things' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 12 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Stranger Things' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 10 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Stranger Things' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 10 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Stranger Things' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 6 DAY) + INTERVAL 12 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Stranger Things' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 7 DAY) + INTERVAL 10 HOUR, 70000, 'ACTIVE');

-- Wanda Vision
INSERT INTO LICHCHIEU (MaPhim, MaPhong, GioChieu, GiaVe, TrangThai) VALUES
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Wanda Vision' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 12 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Wanda Vision' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 12 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Wanda Vision' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 12 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Wanda Vision' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 12 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Wanda Vision' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 12 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Wanda Vision' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 6 DAY) + INTERVAL 12 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Wanda Vision' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 7 DAY) + INTERVAL 12 HOUR, 70000, 'ACTIVE');

-- The Mandalorian
INSERT INTO LICHCHIEU (MaPhim, MaPhong, GioChieu, GiaVe, TrangThai) VALUES
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'The Mandalorian' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 10 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'The Mandalorian' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 12 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'The Mandalorian' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 10 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'The Mandalorian' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 10 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'The Mandalorian' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 12 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'The Mandalorian' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 10 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'The Mandalorian' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 6 DAY) + INTERVAL 12 HOUR, 70000, 'ACTIVE');

-- The Penthouse
INSERT INTO LICHCHIEU (MaPhim, MaPhong, GioChieu, GiaVe, TrangThai) VALUES
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'The Penthouse' LIMIT 1), 4, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 13 HOUR, 150000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'The Penthouse' LIMIT 1), 4, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 13 HOUR, 150000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'The Penthouse' LIMIT 1), 4, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 15 HOUR, 150000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'The Penthouse' LIMIT 1), 4, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 13 HOUR, 150000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'The Penthouse' LIMIT 1), 4, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 15 HOUR, 150000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'The Penthouse' LIMIT 1), 4, DATE_ADD(NOW(), INTERVAL 6 DAY) + INTERVAL 13 HOUR, 150000, 'ACTIVE');

-- Star Trek
INSERT INTO LICHCHIEU (MaPhim, MaPhong, GioChieu, GiaVe, TrangThai) VALUES
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Star Trek' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 10 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Star Trek' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 12 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Star Trek' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 10 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Star Trek' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 12 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Star Trek' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 10 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Star Trek' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 6 DAY) + INTERVAL 12 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Star Trek' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 7 DAY) + INTERVAL 10 HOUR, 120000, 'ACTIVE');

-- The Falcon and The Winter Soldier
INSERT INTO LICHCHIEU (MaPhim, MaPhong, GioChieu, GiaVe, TrangThai) VALUES
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'The Falcon and The Winter Soldier' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 13 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'The Falcon and The Winter Soldier' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 13 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'The Falcon and The Winter Soldier' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 13 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'The Falcon and The Winter Soldier' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 13 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'The Falcon and The Winter Soldier' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 13 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'The Falcon and The Winter Soldier' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 6 DAY) + INTERVAL 13 HOUR, 70000, 'ACTIVE');

-- ============================================
-- CARTOONS - Lịch chiếu đầy đủ cho tất cả 7 phim CARTOON
-- ============================================

-- Demon Slayer
INSERT INTO LICHCHIEU (MaPhim, MaPhong, GioChieu, GiaVe, TrangThai) VALUES
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Demon Slayer' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 9 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Demon Slayer' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 11 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Demon Slayer' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 9 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Demon Slayer' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 9 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Demon Slayer' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 9 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Demon Slayer' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 9 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Demon Slayer' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 6 DAY) + INTERVAL 11 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Demon Slayer' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 7 DAY) + INTERVAL 9 HOUR, 70000, 'ACTIVE');

-- Your Name
INSERT INTO LICHCHIEU (MaPhim, MaPhong, GioChieu, GiaVe, TrangThai) VALUES
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Your Name' LIMIT 1), 4, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 14 HOUR, 130000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Your Name' LIMIT 1), 4, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 14 HOUR, 130000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Your Name' LIMIT 1), 4, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 16 HOUR, 130000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Your Name' LIMIT 1), 4, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 14 HOUR, 130000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Your Name' LIMIT 1), 4, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 16 HOUR, 130000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Your Name' LIMIT 1), 4, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 14 HOUR, 130000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Your Name' LIMIT 1), 4, DATE_ADD(NOW(), INTERVAL 6 DAY) + INTERVAL 16 HOUR, 130000, 'ACTIVE');

-- Coco
INSERT INTO LICHCHIEU (MaPhim, MaPhong, GioChieu, GiaVe, TrangThai) VALUES
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Coco' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 10 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Coco' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 10 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Coco' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 10 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Coco' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 10 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Coco' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 12 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Coco' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 6 DAY) + INTERVAL 10 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Coco' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 7 DAY) + INTERVAL 12 HOUR, 70000, 'ACTIVE');

-- The Croods
INSERT INTO LICHCHIEU (MaPhim, MaPhong, GioChieu, GiaVe, TrangThai) VALUES
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'The Croods' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 12 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'The Croods' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 12 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'The Croods' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 14 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'The Croods' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 12 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'The Croods' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 14 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'The Croods' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 6 DAY) + INTERVAL 12 HOUR, 70000, 'ACTIVE');

-- Dragon
INSERT INTO LICHCHIEU (MaPhim, MaPhong, GioChieu, GiaVe, TrangThai) VALUES
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Dragon' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 11 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Dragon' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 13 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Dragon' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 11 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Dragon' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 13 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Dragon' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 11 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Dragon' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 6 DAY) + INTERVAL 13 HOUR, 120000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Dragon' LIMIT 1), 3, DATE_ADD(NOW(), INTERVAL 7 DAY) + INTERVAL 11 HOUR, 120000, 'ACTIVE');

-- Over The Moon
INSERT INTO LICHCHIEU (MaPhim, MaPhong, GioChieu, GiaVe, TrangThai) VALUES
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Over The Moon' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 13 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Over The Moon' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 15 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Over The Moon' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 13 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Over The Moon' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 15 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Over The Moon' LIMIT 1), 1, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 13 HOUR, 70000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Over The Moon' LIMIT 1), 2, DATE_ADD(NOW(), INTERVAL 6 DAY) + INTERVAL 15 HOUR, 70000, 'ACTIVE');

-- Weathering With You
INSERT INTO LICHCHIEU (MaPhim, MaPhong, GioChieu, GiaVe, TrangThai) VALUES
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Weathering With You' LIMIT 1), 4, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 15 HOUR, 130000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Weathering With You' LIMIT 1), 4, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 17 HOUR, 130000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Weathering With You' LIMIT 1), 4, DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 15 HOUR, 130000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Weathering With You' LIMIT 1), 4, DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 17 HOUR, 130000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Weathering With You' LIMIT 1), 4, DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 15 HOUR, 130000, 'ACTIVE'),
((SELECT MaPhim FROM PHIM WHERE TenPhim = 'Weathering With You' LIMIT 1), 4, DATE_ADD(NOW(), INTERVAL 6 DAY) + INTERVAL 17 HOUR, 130000, 'ACTIVE');

-- 7. VÉ MẪU (Tạo một số vé đã đặt để test)
-- Lấy một số lịch chiếu để tạo vé
INSERT INTO VE (MaKH, MaLich, GheNgoi, NgayMua, TongTien, TrangThai)
SELECT 
    3 as MaKH, -- user1
    lc.MaLich,
    CONCAT(CHAR(65 + (lc.MaLich % 8)), (lc.MaLich % 10 + 1)) as GheNgoi,
    DATE_SUB(NOW(), INTERVAL (lc.MaLich % 7) DAY),
    lc.GiaVe,
    'ACTIVE'
FROM LICHCHIEU lc
WHERE lc.GioChieu > NOW()
ORDER BY lc.MaLich
LIMIT 10;

INSERT INTO VE (MaKH, MaLich, GheNgoi, NgayMua, TongTien, TrangThai)
SELECT 
    4 as MaKH, -- user2
    lc.MaLich,
    CONCAT(CHAR(65 + ((lc.MaLich + 1) % 8)), ((lc.MaLich + 1) % 10 + 1)) as GheNgoi,
    DATE_SUB(NOW(), INTERVAL ((lc.MaLich + 1) % 7) DAY),
    lc.GiaVe,
    'ACTIVE'
FROM LICHCHIEU lc
WHERE lc.GioChieu > NOW()
ORDER BY lc.MaLich
LIMIT 8;

-- ============================================
-- KIỂM TRA DỮ LIỆU
-- ============================================
SELECT '=== THỐNG KÊ DỮ LIỆU ===' as Info;
SELECT 'Tổng số khách hàng:' as Info, COUNT(*) as Total FROM KHACHHANG;
SELECT 'Tổng số phim:' as Info, COUNT(*) as Total FROM PHIM;
SELECT 'Phim theo loại:' as Info, Loai, COUNT(*) as Total FROM PHIM GROUP BY Loai;
SELECT 'Tổng số phòng chiếu:' as Info, COUNT(*) as Total FROM PHONGCHIEU;
SELECT 'Tổng số lịch chiếu:' as Info, COUNT(*) as Total FROM LICHCHIEU;
SELECT 'Tổng số vé:' as Info, COUNT(*) as Total FROM VE;

-- ============================================
-- THÔNG TIN ĐĂNG NHẬP MẶC ĐỊNH
-- ============================================
-- Admin: username = admin, password = 123456
-- Staff: username = staff1, password = 123456
-- User: username = user1, password = 123456
-- User: username = user2, password = 123456
-- 
-- Lưu ý: Mật khẩu đã được hash bằng bcrypt
-- Nếu cần reset mật khẩu, có thể chạy lại script hoặc update trực tiếp trong code


CREATE TABLE THANHTOAN (
  MaTT INT PRIMARY KEY AUTO_INCREMENT,
  MaKH INT NOT NULL,
  MaLich INT NOT NULL,
  SoTien DECIMAL(10, 2) NOT NULL,
  TrangThai VARCHAR(50) DEFAULT 'PENDING',
  MaGD VARCHAR(50) UNIQUE NOT NULL,
  ResponseCode VARCHAR(10),
  NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
  NgayCapNhat DATETIME ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (MaKH) REFERENCES KHACHHANG(MaKH),
  FOREIGN KEY (MaLich) REFERENCES LICHCHIEU(MaLich)
);

-- Bảng lưu thông tin vé chưa thanh toán (tạm thời)
CREATE TABLE GIAODICH_TMP (
  MaGiaoDichTmp INT PRIMARY KEY AUTO_INCREMENT,
  MaKH INT NOT NULL,
  MaLich INT NOT NULL,
  GheNgoi VARCHAR(10) NOT NULL,
  TrangThai VARCHAR(50) DEFAULT 'PENDING', -- PENDING, COMPLETED, EXPIRED, CANCELLED
  NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
  HetHan DATETIME, -- 5 phút sau NgayTao
  MaGD VARCHAR(50), -- Mã giao dịch VNPay (nếu có)
  FOREIGN KEY (MaKH) REFERENCES KHACHHANG(MaKH),
  FOREIGN KEY (MaLich) REFERENCES LICHCHIEU(MaLich),
  INDEX idx_ma_lich (MaLich),
  INDEX idx_het_han (HetHan)
);

CREATE TABLE DICHVU (
    MaDV INT AUTO_INCREMENT PRIMARY KEY,
    TenDV VARCHAR(100) NOT NULL,
    MoTa VARCHAR(255),
    HinhAnh VARCHAR(255),
    Gia INT NOT NULL,
    TrangThai TINYINT DEFAULT 1   -- 1 = còn bán, 0 = ngừng bán
);


CREATE TABLE DICHVU_CHITIET (
    MaCT INT AUTO_INCREMENT PRIMARY KEY,
    MaDV INT NOT NULL,
    TenItem VARCHAR(100),
    FOREIGN KEY (MaDV) REFERENCES DICHVU(MaDV)
);
CREATE TABLE GIOHANG_DV (
  MaGH INT PRIMARY KEY AUTO_INCREMENT,
  MaKH INT NOT NULL,
  MaDV INT NOT NULL,
  SoLuong INT NOT NULL DEFAULT 1,
  NgayThem DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (MaKH) REFERENCES KHACHHANG(MaKH),
  FOREIGN KEY (MaDV) REFERENCES DICHVU(MaDV)
);
CREATE TABLE CHITIETTHANHTOAN_DV (
  MaTT INT NOT NULL,               -- Khóa chính của THANHTOAN
  MaDV INT NOT NULL,               -- Món dịch vụ
  DonGia DECIMAL(10,2) NOT NULL,   -- Giá tại thời điểm mua
  SoLuong INT NOT NULL,
  ThanhTien DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (MaTT, MaDV),
  FOREIGN KEY (MaTT) REFERENCES THANHTOAN(MaTT),
  FOREIGN KEY (MaDV) REFERENCES DICHVU(MaDV)
);
-- thừa bảng dicvuVe