import { giaoDichTmp_Repo } from '../repositories/GiaoDichTmp_repo.js';
import { logger } from '../config/logger.js';

setInterval(async () => {
  try {
    const removed = await giaoDichTmp_Repo.removeExpired_Repo();
    if (removed > 0) {
      logger.info(`Đã xoá ${removed} ghế hết hạn khỏi GIAODICH_TMP`)
    }
  } catch (error) {
    logger.error('Cron xoá ghế hết hạn lỗi:', error);
  }
}, 60000); // 1 phút
