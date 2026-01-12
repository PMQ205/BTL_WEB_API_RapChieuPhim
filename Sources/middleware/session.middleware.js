// Middleware để check session cho views
export function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login?redirect=' + encodeURIComponent(req.originalUrl))
  }
  next()
}

// Middleware để check role
export function requireRole(roles = []) {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/login')
    }
    if (!roles.includes(req.session.user.role)) {
      return res.status(403).send('Không có quyền truy cập')
    }
    next()
  }
}

// Middleware để set user info vào locals (cho views)
// export function setUserLocals(req, res, next) {
//   if (req.session.user) {
//     res.locals.user = req.session.user
//     res.locals.isAuthenticated = true
//   } else {
//     res.locals.isAuthenticated = false
//   }
//   next()
// }


// export const setUserLocals = (req, res, next) => {
//   res.locals.isAuthenticated = !!req.user;
//   res.locals.user = req.user || null;
//   next();
// };

export const setUserLocals = (req, res, next) => {
  // Nếu passport login (GG/GitHub)
  if (req.user) {
    res.locals.user = req.user;
    res.locals.isAuthenticated = true;

    // Đồng bộ vào session nếu chưa có (để code cũ vẫn chạy)
    if (!req.session.user) {
      req.session.user = req.user;
    }
    return next();
  }

  // Nếu login thường bằng form
  if (req.session && req.session.user) {
    res.locals.user = req.session.user;
    res.locals.isAuthenticated = true;
    return next();
  }

  // Không login
  res.locals.user = null;
  res.locals.isAuthenticated = false;
  next();
};
