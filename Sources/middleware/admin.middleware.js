
// Sources/middleware/admin.middleware.js (tiếp)
import { permissionRepo } from '../repositories/Permission_repo.js';

// Sources/middleware/admin.middleware.js
const ROLE = {
    STAFF: 2,
    ADMIN: 1,
    USER: 3
  };
  
  export function requireAdminArea(req, res, next) {
    if (!req.session || !req.session.user) {
      return res.redirect('/login?redirect=' + encodeURIComponent(req.originalUrl));
    }
  
    const role = req.session.user.role;
    if (role !== ROLE.STAFF && role !== ROLE.ADMIN) {
      return res.status(403).render('error', {
        message: 'Bạn không có quyền truy cập khu vực quản trị',
      });
    }
  
    next();
  }
  
  // req.userPermissions = ['USER_MANAGE', 'MOVIE_MANAGE', ...]
  export function requirePermission(permissionCode) {
    return (req, res, next) => {
      if (!req.session || !req.session.user) {
        return res.redirect('/login');
      }
  
      const role = req.session.user.role;
      // Admin thì full quyền
      if (role === ROLE.ADMIN) {
        return next();
      }
  
      const perms = req.userPermissions || [];
      if (!perms.includes(permissionCode)) {
        return res.status(403).render('error', {
          message: 'Bạn không có quyền sử dụng chức năng này',
        });
      }
  
      next();
    };
  }

  // Sources/middleware/admin.middleware.js (tiếp)

export async function loadUserPermissions(req, res, next) {
  try {
    if (!req.session || !req.session.user) {
      req.userPermissions = [];
      res.locals.userPermissions = [];
      return next();
    }

    const { id, role } = req.session.user;

    // Admin: full quyền (có thể cho hiển thị tất cả menu)
    if (role === ROLE.ADMIN) {
      const all = await permissionRepo.getAllPermissions();
      const codes = all.map((p) => p.MaCode);
      req.userPermissions = codes;
      res.locals.userPermissions = codes;
      return next();
    }

    // Staff: lấy quyền theo NHÂNVIEN_QUYEN
    const perms = await permissionRepo.getPermissionsByUser(id);
    const codes = perms.map((p) => p.MaCode);

    req.userPermissions = codes;
    res.locals.userPermissions = codes;
    next();
  } catch (err) {
    console.error('loadUserPermissions error', err);
    req.userPermissions = [];
    res.locals.userPermissions = [];
    next();
  }
}