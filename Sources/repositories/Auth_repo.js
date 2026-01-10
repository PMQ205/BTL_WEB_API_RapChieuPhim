import { pool } from '../config/Database/db.js'

export const authRepo = {
  findByUsername: async (username) => {
    const db = await pool
    const [rows] = await db.query('SELECT * FROM KHACHHANG WHERE TenDangNhap = ?', [username])
    return rows[0] || null
  },

  findByEmail: async (email) => {
    const db = await pool
    const [rows] = await db.query('SELECT * FROM KHACHHANG WHERE Email = ?', [email])
    return rows[0] || null
  },

  createUser: async (data) => {
    const db = await pool
    const [result] = await db.query('INSERT INTO KHACHHANG SET ?', data)
    return result.insertId
  },
}
