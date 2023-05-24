import { Router } from 'express';
import passport from 'passport';
import { User } from '@/models/user';
import axios from 'axios';

const router = Router();

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  await User.findById(id).then((user) => {
    done(null, user);
  });
});

router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
);

router.get(
  process.env.BACKEND_AUTH_CALLBACK_ROUTE,
  passport.authenticate('google'),
  (req, res) => {
    res.redirect('/');
  },
);

async function validateToken(token: string) {
  const googleTokenInfoUrl = `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`;
  const response = await axios.get(googleTokenInfoUrl);
  if (response.status === 200) {
    return response.data.aud === process.env.GOOGLE_CLIENT_ID!; // Replace YOUR_CLIENT_ID with your Google Client ID
  } else {
    return false;
  }
}

router.get('/auth/validate', async (req, res) => {
  const token = req.headers['authorization'];

  // Validate the token and retrieve the user
  const isValid = await validateToken(token); // This function would contain your token validation logic

  if (isValid) {
    res.status(200).json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

export { router as authRouter };
