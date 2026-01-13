import { pool } from '../config/Database/db.js'

export const dichVu_Repo = {
  getAll_Repo: async () => {
    const db = await pool
    const [rows] = await db.query('SELECT * FROM DICHVU WHERE TrangThai = 1')
    return rows
  },

  getById_Repo: async (MaDV) => {
    const db = await pool
    const [rows] = await db.query('SELECT * FROM DICHVU WHERE MaDV = ?', [MaDV])
    return rows
  }
}
