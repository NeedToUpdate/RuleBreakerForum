import { Router } from 'express';
import passport from 'passport';
import { IUser, User } from '@/models/user';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const router = Router();

passport.serializeUser((user: any, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email: string, done) => {
  await User.findOne({ email: email }).then((user) => {
    done(null, user);
  });
});

router.get(
  '/auth/google',
  (req, res, next) => {
    const { redirectTo } = req.query;
    const state = JSON.stringify({ redirectTo });
    const authenticator = passport.authenticate('google', {
      scope: ['profile', 'email'],
      state,
      session: true,
    });
    authenticator(req, res, next);
  },
  (req, res, next) => {
    next();
  },
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google'),
  (req, res, next) => {
    const token = jwt.sign(
      { email: (req.user as IUser).email },
      process.env.JWT_SECRET,
      {
        expiresIn: 60 * 60 * 24 * 1000,
      },
    );
    res.redirect(`${process.env.FRONTEND_URI}/login?token=${token}`);
  },
);

router.get(
  '/auth/github',
  (req, res, next) => {
    const { redirectTo } = req.query;
    const state = JSON.stringify({ redirectTo });
    const authenticator = passport.authenticate('github', {
      scope: 'user:email',
      state,
      session: true,
    });
    authenticator(req, res, next);
  },
  (req, res, next) => {
    next();
  },
);

router.get(
  '/auth/github/callback',
  passport.authenticate('github'),
  (req, res, next) => {
    const token = jwt.sign(
      { email: (req.user as IUser).email },
      process.env.JWT_SECRET,
      {
        expiresIn: 60 * 60 * 24 * 1000,
      },
    );
    res.redirect(`${process.env.FRONTEND_URI}/login?token=${token}`);
  },
);

async function validateToken(token: string) {
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return !!user;
  } catch (e) {
    console.error(e);
    return false;
  }
}

router.get('/auth/validate', async (req, res) => {
  const { token } = req.query;
  // Validate the token and retrieve the user
  const isValid = await validateToken(token as string); // This function would contain your token validation logic
  if (isValid) {
    res.status(200).json({ authenticated: true });
  } else {
    res.status(403).json({ authenticated: false });
  }
});

router.get(
  '/auth/session',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.status(200).json(req.user);
  },
);

export { router as authRouter };
