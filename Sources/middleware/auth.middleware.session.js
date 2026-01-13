// Middleware để check session hoặc JWT token cho API
import jwt from 'jsonwebtoken'

export function authenticate(req, res, next) {
  // Ưu tiên check session (cho views)
  if (req.session && req.session.user) {
    req.user = {
      id: req.session.user.id,
      role: req.session.user.role,
    }
    return next()
  }

  // Nếu không có session, check JWT token (cho API)
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.redirect('/login');

  }
  const token = authHeader.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'Token không hợp lệ' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = { id: decoded.id, role: decoded.role }
    next()
  } catch {
    return res.status(401).json({ message: 'Token không hợp lệ' })
  }
}
