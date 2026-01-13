import { pool } from '../config/Database/db.js';

export const authRepo = {
  findByUsername: async (username) => {
    const db = await pool;
    const [rows] = await db.query('SELECT * FROM KHACHHANG WHERE TenDangNhap = ?', [username]);
    return rows[0] || null;
  },
  findByEmail: async (email) => {
    const db = await pool;
    const [rows] = await db.query(`SELECT * FROM KHACHHANG WHERE Email = ?`, [email]);
    return rows[0] || null;
  },

  findByProvider: async (provider, providerId) => {
    const db = await pool;
    const [rows] = await db.query(
      `SELECT * FROM KHACHHANG WHERE provider = ? AND provider_id = ?`,
      [provider, providerId]
    );
    return rows[0] || null;
  },

  findById: async (id) => {
    const db = await pool;
    const [rows] = await db.query(`SELECT * FROM KHACHHANG WHERE MaKH = ?`, [id]);
    console.log('findById query result:', rows[0]); // DEBUG
    return rows[0] || null;
  },

  createUser: async ({ TenKH, Email, TenDangNhap, MatKhau }) => {
    const db = await pool;
    const [result] = await db.query(
      `
      INSERT INTO KHACHHANG (TenKH, Email, TenDangNhap, MatKhau)
      VALUES (?, ?, ?, ?)
      `,
      [TenKH, Email, TenDangNhap, MatKhau]
    );
    return result.insertId;
  },

  // create or link OAuth user: if user with same email exists, link provider; otherwise insert new
  createOAuthUser: async ({ name, email, provider, providerId }) => {
    const db = await pool;

    // If email exists, try to link provider to that account
    if (email) {
      const [existingRows] = await db.query(`SELECT * FROM KHACHHANG WHERE Email = ?`, [email]);
      const existing = existingRows[0];
      if (existing) {
        console.log('Found existing user with email:', email, 'MaKH:', existing.MaKH); // DEBUG
        // If provider already linked, return existing user
        if (existing.provider === provider && existing.provider_id === providerId) {
          return existing;
        }
        // Link provider to existing account (update)
        await db.query(
          `UPDATE KHACHHANG SET provider = ?, provider_id = ? WHERE MaKH = ?`,
          [provider, providerId, existing.MaKH]
        );
        return existing; // ← RETURN USER OBJECT, NOT JUST ID
      }
    }

    // generate base username
    const baseUsername = email ? email.split('@')[0] : name.replace(/\s+/g, '').toLowerCase();
    let username = `${baseUsername}_${provider}`.toLowerCase();

    // ensure username uniqueness
    let suffix = 0;
    while (true) {
      const [rows] = await db.query(`SELECT COUNT(*) as cnt FROM KHACHHANG WHERE TenDangNhap = ?`, [username]);
      if (rows[0].cnt === 0) break;
      suffix += 1;
      username = `${baseUsername}_${provider}${suffix}`.toLowerCase();
    }

    const [result] = await db.query(
      `
      INSERT INTO KHACHHANG (TenKH, Email, TenDangNhap, MatKhau, provider, provider_id)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [name, email || null, username, '', provider, providerId]
    );

    console.log('Created new OAuth user. insertId:', result.insertId); // DEBUG
    
    // RETURN THE NEW USER OBJECT, NOT JUST ID
    const newUser = await authRepo.findById(result.insertId);
    return newUser;
  },
};