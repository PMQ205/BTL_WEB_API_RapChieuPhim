// import mysql from "mysql2/promise";

// import "dotenv/config";
// import { logger } from "../logger.js";

// const connectionOptions = process.env.MYSQL_URI ?? {
//   host: process.env.MYSQL_HOST || "localhost",
//   port: process.env.MYSQL_PORT || 3306,
//   user: process.env.MYSQL_USERNAME || "root",
//   password: process.env.MYSQL_PASSWORD || "Quan175204@",
//   database: process.env.MYSQL_DBNAME || "RAPCHIEUPHIM",
// };

// export const pool = mysql.createPool(connectionOptions);

// pool
//   .getConnection()
//   .then(() => logger.info("MySQL connected successfully"))
//   .catch((err) => logger.error("MySQL connection failed", err));

import mysql from "mysql2/promise";
import "dotenv/config";
import { logger } from "../logger.js";

// 1. Chỉ để object chứa thông số, KHÔNG dùng mysql.createConnection ở đây
const connectionOptions = {
  host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  port: 4000,
  user: '3M1BsA6qzQeBynS.root',
  password: 'NZMksOfJ2Ygfo29h',
  database: 'RAPCHIEUPHIM', // Đã sửa lỗi chính tả: IU -> IE
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true // Đảm bảo kết nối an toàn với TiDB Cloud
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// 2. Truyền object cấu hình vào Pool
export const pool = mysql.createPool(connectionOptions);

// 3. Kiểm tra kết nối
pool
  .getConnection()
  .then((conn) => {
    logger.info("✅ MySQL connected successfully to TiDB Cloud");
    conn.release(); // Giải phóng kết nối sau khi kiểm tra xong
  })
  .catch((err) => {
    logger.error("❌ MySQL connection failed");
    console.error(err); // In chi tiết lỗi ra console để debug
  });
