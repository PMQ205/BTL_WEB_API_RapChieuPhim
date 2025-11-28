const db = require('../config/db');

// Lấy tất cả phim
exports.getAll = (req, res) => {
    const sql = 'SELECT * FROM PHIM';

    db.query(sql, (err, rows) => {
        if (err) return res.status(500).json({ error: 'Lỗi DB', detail: err });
        res.json(rows);
    });
};

// Lấy 1 phim theo MaPhim
exports.getById = (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM PHIM WHERE MaPhim = ?';

    db.query(sql, [id], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Lỗi DB', detail: err });
        if (rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy phim' });
        res.json(rows[0]);
    });
};

// Thêm phim mới
exports.create = (req, res) => {
    const { TenPhim, TheLoai, TomTat, Trailer, ThoiLuong, DaoDien, DienVien } = req.body;

    const sql = `
        INSERT INTO PHIM (TenPhim, TheLoai, TomTat, Trailer, ThoiLuong, DaoDien, DienVien)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [TenPhim, TheLoai, TomTat, Trailer, ThoiLuong, DaoDien, DienVien], (err, result) => {
        if (err) return res.status(500).json({ error: 'Lỗi DB', detail: err });

        res.status(201).json({
            MaPhim: result.insertId,
            TenPhim, TheLoai, TomTat, Trailer, ThoiLuong, DaoDien, DienVien
        });
    });
};

// Cập nhật phim
exports.update = (req, res) => {
    const { id } = req.params;
    const { TenPhim, TheLoai, TomTat, Trailer, ThoiLuong, DaoDien, DienVien } = req.body;

    const sql = `
        UPDATE PHIM
        SET TenPhim = ?, TheLoai = ?, TomTat = ?, Trailer = ?, ThoiLuong = ?, DaoDien = ?, DienVien = ?
        WHERE MaPhim = ?
    `;

    db.query(sql, [TenPhim, TheLoai, TomTat, Trailer, ThoiLuong, DaoDien, DienVien, id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Lỗi DB', detail: err });

        if (result.affectedRows === 0)
            return res.status(404).json({ error: 'Không tìm thấy phim để cập nhật' });

        res.json({
            MaPhim: Number(id),
            TenPhim, TheLoai, TomTat, Trailer, ThoiLuong, DaoDien, DienVien
        });
    });
};

// Xoá phim
exports.remove = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM PHIM WHERE MaPhim = ?';

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: 'Lỗi DB', detail: err });

        if (result.affectedRows === 0)
            return res.status(404).json({ error: 'Không tìm thấy phim để xoá' });

        res.json({ message: 'Đã xoá phim', MaPhim: Number(id) });
    });
};
