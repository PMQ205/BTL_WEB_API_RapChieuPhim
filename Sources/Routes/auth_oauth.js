import { Router } from 'express';
import passport from '../config/passport.js';

const router = Router();

// Google OAuth - thêm prompt: 'select_account' để chọn tài khoản
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'],
  prompt: 'select_account'  // ← THÊM DÒNG NÀY
}));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failure' }),
  (req, res) => {
    console.log('Google login success handler. req.user:', req.user);
    req.login(req.user, (err) => {
      if (err) {
        console.error('req.login error:', err);
        return res.redirect('/auth/failure');
      }
      req.session.save((err) => {
        if (err) console.error('session.save error:', err);
        console.log('Session saved. sessionID:', req.sessionID);
        res.redirect('/');
      });
    });
  }
);

// GitHub OAuth - thêm allowSignup: true
router.get('/github', passport.authenticate('github', { 
  scope: ['user:email'],
  allowSignup: true  // ← THÊM DÒNG NÀY (cho phép user chọn account khác)
}));

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/failure' }),
  (req, res) => {
    console.log('GitHub login success handler. req.user:', req.user);
    req.login(req.user, (err) => {
      if (err) {
        console.error('req.login error:', err);
        return res.redirect('/auth/failure');
      }
      req.session.save((err) => {
        if (err) console.error('session.save error:', err);
        console.log('Session saved. sessionID:', req.sessionID);
        res.redirect('/');
      });
    });
  }
);

router.get('/failure', (req, res) => {
  console.warn('OAuth failure callback hit. Query:', req.query);
  res.status(401).send({ ok: false, message: 'Authentication failed', query: req.query });
});

export default router;