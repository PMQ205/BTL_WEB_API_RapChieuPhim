import { logger } from "../config/logger.js";

export function errorHandler(err, req, res, next) {
  if (!err.status || err.status >= 500) {
    logger.error(err);
  }

  res.status(err.status || 500).json({
    message: err.message || "Lỗi máy chủ",
  });
}
