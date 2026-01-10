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
export function setUserLocals(req, res, next) {
  if (req.session.user) {
    res.locals.user = req.session.user
    res.locals.isAuthenticated = true
  } else {
    res.locals.isAuthenticated = false
  }
  next()
}
