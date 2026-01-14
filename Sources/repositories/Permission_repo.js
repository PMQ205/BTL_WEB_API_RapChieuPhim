// Sources/repositories/Permission_repo.js
import { pool } from '../config/Database/db.js';

export const permissionRepo = {
  getAllPermissions: async () => {
    const db = await pool;
    const [rows] = await db.query('SELECT * FROM QUYEN ORDER BY MaQuyen');
    return rows;
  },

  getPermissionsByUser: async (maKH) => {
    const db = await pool;
    const [rows] = await db.query(
      `
      SELECT q.*
      FROM NHANVIEN_QUYEN nq
      JOIN QUYEN q ON q.MaQuyen = nq.MaQuyen
      WHERE nq.MaKH = ?
      ORDER BY q.MaQuyen
      `,
      [maKH]
    );
    return rows;
  },

  setPermissionsForUser: async (maKH, maQuyenList) => {
    const db = await pool;
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query('DELETE FROM NHANVIEN_QUYEN WHERE MaKH = ?', [maKH]);

      if (maQuyenList.length > 0) {
        const values = maQuyenList.map((mq) => [maKH, mq]);
        await conn.query(
          'INSERT INTO NHANVIEN_QUYEN (MaKH, MaQuyen) VALUES ?',
          [values]
        );
      }

      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },
};