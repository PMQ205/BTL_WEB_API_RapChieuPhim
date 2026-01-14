// Sources/repositories/NhanVien_repo.js
import { pool } from '../config/Database/db.js';

const ROLE = {
  USER: 3,
  STAFF: 2,
  ADMIN: 1,
};

export const nhanVienRepo = {
  getAllStaff: async () => {
    const db = await pool;
    const [rows] = await db.query(
      'SELECT MaKH, TenKH, SDT, Email, MaRole FROM KHACHHANG WHERE MaRole = ?',
      [ROLE.STAFF]
    );
    return rows;
  },

  createStaff: async ({ TenKH, Email, TenDangNhap, MatKhau, SDT }) => {
    const db = await pool;
    const [result] = await db.query(
      `
      INSERT INTO KHACHHANG (TenKH, Email, TenDangNhap, MatKhau, SDT, MaRole)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [TenKH, Email, TenDangNhap, MatKhau, SDT || null, ROLE.STAFF]
    );
    return result.insertId;
  },

  deleteStaff: async (maKH) => {
    const db = await pool;
    await db.query('DELETE FROM KHACHHANG WHERE MaKH = ? AND MaRole = ?', [
      maKH,
      ROLE.STAFF,
    ]);
  },

  updateStaff: async (maKH, data) => {
    const db = await pool;
    const fields = [];
    const values = [];

    if (data.TenKH) {
      fields.push('TenKH = ?');
      values.push(data.TenKH);
    }
    if (data.SDT) {
      fields.push('SDT = ?');
      values.push(data.SDT);
    }
    if (data.Email) {
      fields.push('Email = ?');
      values.push(data.Email);
    }
    if (fields.length === 0) return;

    values.push(maKH, ROLE.STAFF);

    await db.query(
      `
      UPDATE KHACHHANG
      SET ${fields.join(', ')}
      WHERE MaKH = ? AND MaRole = ?
      `,
      values
    );
  },
};