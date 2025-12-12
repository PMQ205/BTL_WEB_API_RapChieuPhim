// logger.js
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Định dạng 1 dòng log
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}] : ${stack || message}`;
});

// Tạo logger
export const logger = winston.createLogger({
  level: "info", // mức log tối thiểu: error < warn < info < http < verbose < debug < silly
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }), // nếu log là error, ghi luôn stack trace
    logFormat
  ),
  transports: [
    // 1. In ra console
    new winston.transports.Console({
      format: combine(
        colorize(), // tô màu level: info xanh, error đỏ, warn vàng...
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
      ),
    }),

    // 2. Ghi tất cả log (info trở lên) vào file, xoay theo ngày
    new DailyRotateFile({
      dirname: "logs",                // thư mục chứa log
      filename: "app-%DATE%.log",     // tên file theo ngày
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",                // giữ log 14 ngày
      zippedArchive: true,            // nén file cũ lại (.gz)
    }),

    // 3. Ghi riêng log level error vào file error-YYYY-MM-DD.log
    new DailyRotateFile({
      dirname: "logs",
      filename: "error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxFiles: "30d",
      zippedArchive: true,
    }),
  ],
  // Bắt luôn lỗi không bắt được
  exceptionHandlers: [
    new DailyRotateFile({
      dirname: "logs",
      filename: "exceptions-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "30d",
      zippedArchive: true,
    }),
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      dirname: "logs",
      filename: "rejections-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "30d",
      zippedArchive: true,
    }),
  ],
});

// Nếu không phải môi trường production, log thêm debug
if (process.env.NODE_ENV !== "production") {
  logger.level = "debug";
}

// (Optional) Nếu dùng với morgan/Express: logger.stream.write(message)
export const loggerStream = {
  write: (message) => {
    logger.http(message.trim());
  },
};
