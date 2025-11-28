const express = require('express');
const router = express.Router();
const filmController = require('../Controllers/filmController');

// GET /api/phim            → lấy tất cả
router.get('/', filmController.getAll);

// GET /api/phim/:id        → lấy 1 phim
router.get('/:id', filmController.getById);

// POST /api/phim           → thêm phim
router.post('/', filmController.create);

// PUT /api/phim/:id        → cập nhật phim
router.put('/:id', filmController.update);

// DELETE /api/phim/:id     → xoá phim
router.delete('/:id', filmController.remove);

module.exports = router;
