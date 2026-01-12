import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { authRepo } from '../repositories/Auth_repo.js';

const pickId = (user) => {
  if (!user) return null;
  const id = user.MaKH ?? user.id ?? user._id ?? null;
  console.log('pickId result:', id, 'from user:', { MaKH: user.MaKH, id: user.id }); // DEBUG
  return id;
};

passport.serializeUser((user, done) => {
  try {
    const id = pickId(user);
    console.log('serializeUser called with id:', id); // DEBUG
    if (!id) return done(new Error('Cannot serialize user without id'), null);
    return done(null, id);
  } catch (err) {
    console.error('serializeUser error:', err); // DEBUG
    return done(err, null);
  }
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log('deserializeUser called with id:', id); // DEBUG
    if (!id) return done(null, null);
    const user = await authRepo.findById(id);
    console.log('findById query result:', user); // DEBUG
    
    if (!user) return done(null, null);

    // Gắn thêm các field cho EJS dùng + Express/Passport
    user.name = user.TenKH;
    user.username = user.TenDangNhap;
    user.id = user.MaKH;  // ← QUAN TRỌNG: Gắn MaKH thành id cho Passport
    user.role = user.MaRole;  // ← Gắn role nếu cần

    console.log('deserializeUser result user object:', { MaKH: user.MaKH, id: user.id, TenKH: user.TenKH, provider: user.provider }); // DEBUG
    
    return done(null, user);
  } catch (err) {
    console.error('deserializeUser error:', err); // DEBUG
    return done(err, null);
  }
});

const safeEmail = (profile, fallbackPrefix = 'user') => {
  try {
    if (Array.isArray(profile.emails) && profile.emails.length > 0) {
      return profile.emails[0].value;
    }
    if (profile.username) return `${profile.username}@${fallbackPrefix}.local`;
    return `${fallbackPrefix}-${profile.id}@local`;
  } catch {
    return `${fallbackPrefix}-${profile.id}@local`;
  }
};

/* === GOOGLE === */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google strategy callback. id:', profile?.id, 'emails:', profile?.emails);
        const email = safeEmail(profile, 'google');
        const name = profile.displayName || profile.name?.givenName || email;
        const providerId = profile.id;

        let user = await authRepo.findByProvider('google', providerId);

        if (!user) {
          await authRepo.createOAuthUser({
            name,
            email,
            provider: 'google',
            providerId,
          });
          user = await authRepo.findByProvider('google', providerId);
        }

        if (!user) return done(new Error('Failed to create/find Google user'), null);
        return done(null, user);
      } catch (err) {
        console.error('Google strategy error:', err);
        return done(err, null);
      }
    }
  )
);

/* === GITHUB === */
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      // scope should be passed in authenticate() call (we set it in auth_oauth.js)
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('GitHub strategy callback. id:', profile?.id, 'emails:', profile?.emails, 'username:', profile?.username);
        const email = safeEmail(profile, 'github');
        const name = profile.displayName || profile.username || email;
        const providerId = profile.id;

        let user = await authRepo.findByProvider('github', providerId);

        if (!user) {
          await authRepo.createOAuthUser({
            name,
            email,
            provider: 'github',
            providerId,
          });
          user = await authRepo.findByProvider('github', providerId);
        }

        if (!user) return done(new Error('Failed to create/find GitHub user'), null);
        return done(null, user);
      } catch (err) {
        console.error('GitHub strategy error:', err);
        return done(err, null);
      }
    }
  )
);

export default passport;