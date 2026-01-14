// Sources/Routes/Admin_Route.js
import express from 'express';
import { requireAdminArea, loadUserPermissions, requirePermission } from '../middleware/admin.middleware.js';
import { nhanVienRepo } from '../repositories/NhanVien_repo.js';
import { permissionRepo } from '../repositories/Permission_repo.js';
import bcrypt from 'bcryptjs';
import { films_Repo } from '../repositories/Film_repo.js';
import { phongChieu_Repo } from '../repositories/PhongChieu_repo.js';
import { lichChieu_Repo } from '../repositories/LichChieu_repo.js';
import { dichVu_Repo } from '../repositories/DichVu_repo.js';
import { ve_Repo } from '../repositories/Ve_repo.js';
import { giaoDichTmp_Repo } from '../repositories/GiaoDichTmp_repo.js';
import { pool } from '../config/Database/db.js';

const router = express.Router();

// Áp dụng cho toàn bộ /admin
router.use(requireAdminArea, loadUserPermissions);

// Trang dashboard chính
router.get('/', (req, res) => {
  res.render('admin/index', {
    user: req.session.user,
    permissions: res.locals.userPermissions || [],
  });
});

/* ========== QUẢN LÝ NHÂN VIÊN & PHÂN QUYỀN (USER_MANAGE) ========== */

// Danh sách nhân viên + bảng quyền
router.get('/staff', requirePermission('USER_MANAGE'), async (req, res) => {
  const staffList = await nhanVienRepo.getAllStaff();
  const allPermissions = await permissionRepo.getAllPermissions();

  // Chỉ chọn nhân viên khi có tham số staffId (không tự động chọn dòng đầu tiên)
  const selectedId = req.query.staffId ? Number(req.query.staffId) : null;
  let selectedPermissions = [];
  if (selectedId) {
    const perms = await permissionRepo.getPermissionsByUser(selectedId);
    selectedPermissions = perms.map((p) => p.MaQuyen);
  }

  res.render('admin/staff', {
    staffList,
    allPermissions,
    selectedId,
    selectedPermissions,
  });
});

// Thêm nhân viên
router.post('/staff/add', requirePermission('USER_MANAGE'), async (req, res) => {
  const { TenKH, Email, TenDangNhap, MatKhau, SDT } = req.body;

  const hash = bcrypt.hashSync(MatKhau, 10);
  await nhanVienRepo.createStaff({
    TenKH,
    Email,
    TenDangNhap,
    MatKhau: hash,
    SDT,
  });

  res.redirect('/admin/staff');
});

// Xóa nhân viên
router.post('/staff/:id/delete', requirePermission('USER_MANAGE'), async (req, res) => {
  const id = Number(req.params.id);
  await nhanVienRepo.deleteStaff(id);
  res.redirect('/admin/staff');
});

// Cập nhật thông tin nhân viên
router.post('/staff/:id/update', requirePermission('USER_MANAGE'), async (req, res) => {
  const id = Number(req.params.id);
  const { TenKH, SDT, Email } = req.body;

  await nhanVienRepo.updateStaff(id, { TenKH, SDT, Email });
  res.redirect('/admin/staff?staffId=' + id);
});

// Cấp quyền / Thu hồi quyền
router.post('/staff/:id/permissions', requirePermission('USER_MANAGE'), async (req, res) => {
  const id = Number(req.params.id);

  // checkbox name="permissions" value=MaQuyen
  let { permissions } = req.body;
  if (!permissions) {
    permissions = [];
  } else if (!Array.isArray(permissions)) {
    permissions = [permissions];
  }

  const maQuyenList = permissions.map((v) => Number(v));
  await permissionRepo.setPermissionsForUser(id, maQuyenList);
  res.redirect('/admin/staff?staffId=' + id);
});

/* ========== QUẢN LÝ PHIM (MOVIE_MANAGE) ========== */
router.get('/movies', requirePermission('MOVIE_MANAGE'), async (req, res) => {
  const db = await pool;
  const search = req.query.search || '';
  const type = req.query.type || '';
  const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
  const pageSize = 10;
  const offset = (page - 1) * pageSize;

  let where = 'WHERE 1=1';
  const params = [];

  if (search) {
    where += ' AND TenPhim LIKE ?';
    params.push(`%${search}%`);
  }
  if (type) {
    where += ' AND Loai = ?';
    params.push(type);
  }

  const [countRows] = await db.query(`SELECT COUNT(*) AS total FROM PHIM ${where}`, params);
  const total = countRows[0].total || 0;

  const [films] = await db.query(
    `SELECT * FROM PHIM ${where} ORDER BY MaPhim DESC LIMIT ? OFFSET ?`,
    [...params, pageSize, offset]
  );

  res.render('admin/movies', {
    films,
    search,
    type,
    page,
    total,
    pageSize,
    editFilm: null,
  });
});

router.post('/movies/add', requirePermission('MOVIE_MANAGE'), async (req, res) => {
  const { TenPhim, TheLoai, ThoiLuong, Loai, DaoDien, DienVien, Anh, Trailer, TomTat } = req.body;
  await films_Repo.addFilm_Repo({
    TenPhim,
    TheLoai,
    ThoiLuong: ThoiLuong || null,
    Loai: Loai || 'MOVIE',
    DaoDien: DaoDien || null,
    DienVien: DienVien || null,
    Anh: Anh || null,
    Trailer: Trailer || null,
    TomTat: TomTat || null,
  });
  res.redirect('/admin/movies');
});

router.get('/movies/:id/edit', requirePermission('MOVIE_MANAGE'), async (req, res) => {
  const db = await pool;
  const id = Number(req.params.id);
  const [films] = await db.query('SELECT * FROM PHIM ORDER BY MaPhim DESC LIMIT 50');
  const editFilm = films.find(f => f.MaPhim === id) || null;
  res.render('admin/movies', {
    films,
    search: '',
    type: '',
    page: 1,
    total: films.length,
    pageSize: 50,
    editFilm,
  });
});

router.post('/movies/:id/update', requirePermission('MOVIE_MANAGE'), async (req, res) => {
  const id = Number(req.params.id);
  const { TenPhim, TheLoai, ThoiLuong, Loai, DaoDien, DienVien, Anh, Trailer, TomTat } = req.body;
  await films_Repo.updateFilm_Repo(id, {
    TenPhim,
    TheLoai,
    ThoiLuong: ThoiLuong || null,
    Loai: Loai || 'MOVIE',
    DaoDien: DaoDien || null,
    DienVien: DienVien || null,
    Anh: Anh || null,
    Trailer: Trailer || null,
    TomTat: TomTat || null,
  });
  res.redirect('/admin/movies');
});

router.post('/movies/:id/delete', requirePermission('MOVIE_MANAGE'), async (req, res) => {
  const id = Number(req.params.id);
  await films_Repo.deleteFilm_Repo(id);
  res.redirect('/admin/movies');
});

/* ========== QUẢN LÝ PHÒNG CHIẾU (ROOM_MANAGE) ========== */
router.get('/rooms', requirePermission('ROOM_MANAGE'), async (req, res) => {
  const search = req.query.search || '';
  const db = await pool;
  let where = 'WHERE 1=1';
  const params = [];
  if (search) {
    where += ' AND TenPhong LIKE ?';
    params.push(`%${search}%`);
  }
  const [rooms] = await db.query(`SELECT * FROM PHONGCHIEU ${where} ORDER BY MaPhong ASC`, params);
  res.render('admin/rooms', { rooms, error: null, search, editRoom: null });
});

router.post('/rooms/add', requirePermission('ROOM_MANAGE'), async (req, res) => {
  const { TenPhong, SucChua, MoTa } = req.body;
  try {
    await phongChieu_Repo.create_Repo({ TenPhong, SucChua, MoTa });
    res.redirect('/admin/rooms');
  } catch (err) {
    const rooms = await phongChieu_Repo.getAll_Repo();
    res.render('admin/rooms', { rooms, error: err.message || 'Lỗi tạo phòng chiếu', search: '', editRoom: null });
  }
});

router.get('/rooms/:id/edit', requirePermission('ROOM_MANAGE'), async (req, res) => {
  const id = Number(req.params.id);
  const rooms = await phongChieu_Repo.getAll_Repo();
  const editRoom = rooms.find(r => r.MaPhong === id) || null;
  res.render('admin/rooms', { rooms, error: null, search: '', editRoom });
});

router.post('/rooms/:id/update', requirePermission('ROOM_MANAGE'), async (req, res) => {
  const id = Number(req.params.id);
  const { TenPhong, SucChua, MoTa } = req.body;
  await phongChieu_Repo.update_Repo(id, { TenPhong, SucChua, MoTa });
  res.redirect('/admin/rooms');
});

router.post('/rooms/:id/delete', requirePermission('ROOM_MANAGE'), async (req, res) => {
  const id = Number(req.params.id);
  try {
    await phongChieu_Repo.delete_Repo(id);
    res.redirect('/admin/rooms');
  } catch (err) {
    const rooms = await phongChieu_Repo.getAll_Repo();
    res.render('admin/rooms', { rooms, error: err.message || 'Không thể xóa phòng chiếu', search: '', editRoom: null });
  }
});

/* ========== QUẢN LÝ LỊCH CHIẾU (SHOWTIME_MANAGE) ========== */
router.get('/showtimes', requirePermission('SHOWTIME_MANAGE'), async (req, res) => {
  const filmId = req.query.filmId ? Number(req.query.filmId) : null;
  const db = await pool;
  const films = await films_Repo.getAllFilms_Repo();
  const rooms = await phongChieu_Repo.getAll_Repo();

  let where = '1=1';
  const params = [];
  if (filmId) {
    where += ' AND lc.MaPhim = ?';
    params.push(filmId);
  }

  const [showtimes] = await db.query(
    `SELECT lc.*, p.TenPhim, pc.TenPhong 
     FROM LICHCHIEU lc
     JOIN PHIM p ON lc.MaPhim = p.MaPhim
     JOIN PHONGCHIEU pc ON lc.MaPhong = pc.MaPhong
     WHERE ${where}
     ORDER BY lc.GioChieu DESC`,
    params
  );

  res.render('admin/showtimes', { showtimes, films, rooms, error: null, filmId, editShowtime: null });
});

router.post('/showtimes/add', requirePermission('SHOWTIME_MANAGE'), async (req, res) => {
  const { MaPhim, MaPhong, GioChieu, GiaVe } = req.body;
  try {
    await lichChieu_Repo.create_Repo({
      MaPhim,
      MaPhong,
      GioChieu,
      GiaVe,
      TrangThai: 'ACTIVE',
    });
    res.redirect('/admin/showtimes');
  } catch (err) {
    const [showtimes, films, rooms] = await Promise.all([
      lichChieu_Repo.getAll_Repo(),
      films_Repo.getAllFilms_Repo(),
      phongChieu_Repo.getAll_Repo(),
    ]);
    res.render('admin/showtimes', { showtimes, films, rooms, error: err.message || 'Lỗi tạo lịch chiếu', filmId: null, editShowtime: null });
  }
});

router.get('/showtimes/:id/edit', requirePermission('SHOWTIME_MANAGE'), async (req, res) => {
  const id = Number(req.params.id);
  const [showtimes, films, rooms] = await Promise.all([
    lichChieu_Repo.getAll_Repo(),
    films_Repo.getAllFilms_Repo(),
    phongChieu_Repo.getAll_Repo(),
  ]);
  const editShowtime = showtimes.find(s => s.MaLich === id) || null;
  res.render('admin/showtimes', { showtimes, films, rooms, error: null, filmId: null, editShowtime });
});

router.post('/showtimes/:id/update', requirePermission('SHOWTIME_MANAGE'), async (req, res) => {
  const id = Number(req.params.id);
  const { MaPhim, MaPhong, GioChieu, GiaVe, TrangThai } = req.body;
  await lichChieu_Repo.update_Repo(id, { MaPhim, MaPhong, GioChieu, GiaVe, TrangThai });
  res.redirect('/admin/showtimes');
});

router.post('/showtimes/:id/delete', requirePermission('SHOWTIME_MANAGE'), async (req, res) => {
  const id = Number(req.params.id);
  try {
    await lichChieu_Repo.delete_Repo(id);
    res.redirect('/admin/showtimes');
  } catch (err) {
    const [showtimes, films, rooms] = await Promise.all([
      lichChieu_Repo.getAll_Repo(),
      films_Repo.getAllFilms_Repo(),
      phongChieu_Repo.getAll_Repo(),
    ]);
    res.render('admin/showtimes', { showtimes, films, rooms, error: err.message || 'Không thể xóa lịch chiếu', filmId: null, editShowtime: null });
  }
});

/* ========== QUẢN LÝ DỊCH VỤ (SERVICE_MANAGE) ========== */
router.get('/services', requirePermission('SERVICE_MANAGE'), async (req, res) => {
  const db = await pool;
  const search = req.query.search || '';
  const status = req.query.status || '';
  let where = 'WHERE 1=1';
  const params = [];
  if (search) {
    where += ' AND TenDV LIKE ?';
    params.push(`%${search}%`);
  }
  if (status === '1' || status === '0') {
    where += ' AND TrangThai = ?';
    params.push(Number(status));
  }
  const [services] = await db.query(`SELECT * FROM DICHVU ${where} ORDER BY MaDV DESC`, params);
  res.render('admin/services', { services, error: null, search, status, editService: null });
});

router.post('/services/add', requirePermission('SERVICE_MANAGE'), async (req, res) => {
  const { TenDV, MoTa, HinhAnh, Gia, TrangThai } = req.body;
  const db = await pool;
  await db.query(
    'INSERT INTO DICHVU (TenDV, MoTa, HinhAnh, Gia, TrangThai) VALUES (?, ?, ?, ?, ?)',
    [TenDV, MoTa || null, HinhAnh || null, Gia, TrangThai ?? 1]
  );
  res.redirect('/admin/services');
});

router.get('/services/:id/edit', requirePermission('SERVICE_MANAGE'), async (req, res) => {
  const db = await pool;
  const id = Number(req.params.id);
  const [services] = await db.query('SELECT * FROM DICHVU ORDER BY MaDV DESC');
  const editService = services.find(s => s.MaDV === id) || null;
  res.render('admin/services', { services, error: null, search: '', status: '', editService });
});

router.post('/services/:id/update', requirePermission('SERVICE_MANAGE'), async (req, res) => {
  const db = await pool;
  const id = Number(req.params.id);
  const { TenDV, MoTa, HinhAnh, Gia, TrangThai } = req.body;
  await db.query(
    'UPDATE DICHVU SET TenDV = ?, MoTa = ?, HinhAnh = ?, Gia = ?, TrangThai = ? WHERE MaDV = ?',
    [TenDV, MoTa || null, HinhAnh || null, Gia, TrangThai ?? 1, id]
  );
  res.redirect('/admin/services');
});

router.post('/services/:id/toggle', requirePermission('SERVICE_MANAGE'), async (req, res) => {
  const id = Number(req.params.id);
  const db = await pool;
  await db.query(
    'UPDATE DICHVU SET TrangThai = IF(TrangThai=1,0,1) WHERE MaDV = ?',
    [id]
  );
  res.redirect('/admin/services');
});

/* ========== QUẢN LÝ VÉ (TICKET_VIEW) ========== */
router.get('/tickets', requirePermission('TICKET_VIEW'), async (req, res) => {
  const tickets = await ve_Repo.getAll_Repo(null);
  res.render('admin/tickets', { tickets });
});

/* ========== QUẢN LÝ GIAO DỊCH TẠM (TMP_TRANSACTION_VIEW) ========== */
router.get('/tmp-transactions', requirePermission('TMP_TRANSACTION_VIEW'), async (req, res) => {
  const db = await pool;
  const [rows] = await db.query(`
    SELECT tmp.*, kh.TenKH, phim.TenPhim, lc.GioChieu, pc.TenPhong
    FROM GIAODICH_TMP tmp
    JOIN KHACHHANG kh ON tmp.MaKH = kh.MaKH
    JOIN LICHCHIEU lc ON tmp.MaLich = lc.MaLich
    JOIN PHONGCHIEU pc ON lc.MaPhong = pc.MaPhong
    JOIN PHIM phim ON lc.MaPhim = phim.MaPhim
    ORDER BY tmp.NgayTao DESC
  `);
  res.render('admin/tmp-transactions', { transactions: rows });
});

/* ========== BÁO CÁO DOANH THU (REPORT_VIEW) ========== */
router.get('/reports', requirePermission('REPORT_VIEW'), async (req, res) => {
  const db = await pool;

  // Doanh thu theo ngày từ bảng THANHTOAN
  const [byDate] = await db.query(`
    SELECT DATE(NgayTao) AS Ngay, SUM(SoTien) AS TongTien, COUNT(*) AS SoGD
    FROM THANHTOAN
    WHERE TrangThai = 'SUCCESS'
    GROUP BY DATE(NgayTao)
    ORDER BY Ngay DESC
    LIMIT 30
  `);

  // Top phim theo doanh thu (dựa trên VE.TongTien)
  const [byFilm] = await db.query(`
    SELECT p.MaPhim, p.TenPhim, SUM(v.TongTien) AS DoanhThu, COUNT(*) AS SoVe
    FROM VE v
    JOIN LICHCHIEU lc ON v.MaLich = lc.MaLich
    JOIN PHIM p ON lc.MaPhim = p.MaPhim
    GROUP BY p.MaPhim, p.TenPhim
    ORDER BY DoanhThu DESC
    LIMIT 10
  `);

  res.render('admin/reports', { byDate, byFilm });
});

export default router;