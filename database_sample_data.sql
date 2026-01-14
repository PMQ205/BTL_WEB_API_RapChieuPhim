-- Script để insert dữ liệu mẫu vào database
-- Chạy script này để có dữ liệu test

USE RAPCHIEUPHIM;

-- Thêm Phòng chiếu (nếu chưa có)
INSERT INTO PHONGCHIEU (TenPhong, SucChua) 
SELECT * FROM (SELECT 'Phòng 1' as TenPhong, 80 as SucChua) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM PHONGCHIEU WHERE TenPhong = 'Phòng 1')
LIMIT 1;

INSERT INTO PHONGCHIEU (TenPhong, SucChua) 
SELECT * FROM (SELECT 'Phòng 2' as TenPhong, 80 as SucChua) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM PHONGCHIEU WHERE TenPhong = 'Phòng 2')
LIMIT 1;

INSERT INTO PHONGCHIEU (TenPhong, SucChua) 
SELECT * FROM (SELECT 'Phòng 3' as TenPhong, 100 as SucChua) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM PHONGCHIEU WHERE TenPhong = 'Phòng 3')
LIMIT 1;

-- Cập nhật các phim có sẵn để có Loai (nếu chưa có)
UPDATE PHIM SET Loai = 'MOVIE' 
WHERE Loai IS NULL OR Loai = '' 
AND TenPhim IN ('Bat-man', 'Blood-shot', 'Call', 'Captain Marvel', 'End-game', 'Hunter Killer', 'Insidious', 'Love-Rosie', 'Resident Evil', 'Theatre Dead', 'Transformer');

-- Thêm một số phim mới (nếu chưa có)
INSERT IGNORE INTO PHIM (TenPhim, TheLoai, TomTat, Trailer, ThoiLuong, DaoDien, DienVien, Anh, Loai) VALUES
('Black Panther', 'Hành động, Viễn tưởng', 'Vua của Wakanda đối đầu với thử thách mới', '/videos/blackpanther.mp4', 134, 'Ryan Coogler', 'Chadwick Boseman', '/images/black-banner.png', 'MOVIE'),
('John Wick', 'Hành động', 'Sát thủ nghỉ hưu trả thù kẻ đã giết chó của mình', '/videos/johnwick.mp4', 101, 'Chad Stahelski', 'Keanu Reeves', '/images/John wick.jpg', 'MOVIE'),
('Guardians of the Galaxy Vol 3', 'Hành động, Hài', 'Cuộc phiêu lưu cuối cùng của nhóm Guardians', '/videos/gotg3.mp4', 150, 'James Gunn', 'Chris Pratt', '/images/GATG vol3.jpeg', 'MOVIE');

-- Thêm Series
INSERT IGNORE INTO PHIM (TenPhim, TheLoai, TomTat, Trailer, ThoiLuong, DaoDien, DienVien, Anh, Loai) VALUES
('Supergirl', 'Hành động, Siêu anh hùng', 'Siêu cô gái bảo vệ Trái Đất', '/videos/supergirl.mp4', 45, 'Greg Berlanti', 'Melissa Benoist', '/images/series/supergirl.jpg', 'SERIES'),
('Stranger Things', 'Khoa học viễn tưởng, Kinh dị', 'Những bí ẩn tại thị trấn nhỏ', '/videos/strangerthings.mp4', 50, 'Duffer Brothers', 'Millie Bobby Brown', '/images/series/stranger-thing.jpg', 'SERIES'),
('Wanda Vision', 'Siêu anh hùng, Khoa học viễn tưởng', 'Wanda và Vision trong thực tế kỳ lạ', '/videos/wandavision.mp4', 45, 'Matt Shakman', 'Elizabeth Olsen', '/images/series/wanda.png', 'SERIES');

-- Thêm Cartoons
INSERT IGNORE INTO PHIM (TenPhim, TheLoai, TomTat, Trailer, ThoiLuong, DaoDien, DienVien, Anh, Loai) VALUES
('Demon Slayer', 'Anime, Hành động', 'Thanh niên trở thành thợ săn quỷ', '/videos/demonslayer.mp4', 24, 'Haruo Sotozaki', 'Natsuki Hanae', '/images/cartoons/demon-slayer.jpg', 'CARTOON'),
('Your Name', 'Anime, Lãng mạn', 'Hai người lạ đổi thân cho nhau', '/videos/yourname.mp4', 106, 'Makoto Shinkai', 'Ryunosuke Kamiki', '/images/cartoons/your-name.jpg', 'CARTOON'),
('Coco', 'Hoạt hình, Gia đình', 'Cậu bé khám phá thế giới của tổ tiên', '/videos/coco.mp4', 105, 'Lee Unkrich', 'Anthony Gonzalez', '/images/cartoons/coco.jpg', 'CARTOON');

-- Thêm lịch chiếu mẫu
INSERT IGNORE INTO LICHCHIEU (MaPhim, MaPhong, GioChieu, GiaVe)
SELECT 
    p.MaPhim,
    pc.MaPhong,
    DATE_ADD(NOW(), INTERVAL 1 DAY) as GioChieu,
    80000 as GiaVe
FROM PHIM p
CROSS JOIN (SELECT MaPhong FROM PHONGCHIEU WHERE TenPhong = 'Phòng 1' LIMIT 1) pc
WHERE p.TenPhim = 'Bat-man'
LIMIT 1;

INSERT IGNORE INTO LICHCHIEU (MaPhim, MaPhong, GioChieu, GiaVe)
SELECT 
    p.MaPhim,
    pc.MaPhong,
    DATE_ADD(NOW(), INTERVAL 2 DAY) as GioChieu,
    85000 as GiaVe
FROM PHIM p
CROSS JOIN (SELECT MaPhong FROM PHONGCHIEU WHERE TenPhong = 'Phòng 1' LIMIT 1) pc
WHERE p.TenPhim = 'Transformer'
LIMIT 1;

-- Kiểm tra dữ liệu
SELECT 'Tổng số phim:' as Info, COUNT(*) as Total FROM PHIM;
SELECT 'Phim theo Loai:' as Info, Loai, COUNT(*) as Total FROM PHIM GROUP BY Loai;
SELECT 'Tổng số phòng:' as Info, COUNT(*) as Total FROM PHONGCHIEU;
SELECT 'Tổng số lịch chiếu:' as Info, COUNT(*) as Total FROM LICHCHIEU;
