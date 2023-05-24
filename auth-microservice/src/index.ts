import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import cookieSession from 'cookie-session';
import passport from 'passport';
import cors from 'cors';
import { User } from '@/models/user';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { authRouter } from '@/routes/auth';

const app = express();
const port = process.env.AUTH_SERVICE_PORT || 5555;

app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    credentials: true,
  }),
);

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    keys: [process.env.COOKIE_KEY!],
  }),
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.BACKEND_URI}${process.env.BACKEND_AUTH_CALLBACK_ROUTE}`,
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        return done(undefined, existingUser);
      }

      // Here we access the email.
      const email =
        profile.emails && profile.emails[0]
          ? profile.emails[0].value
          : undefined;

      const user = new User({
        googleId: profile.id,
        email: email, // Set email here.
      });
      await user.save();

      done(undefined, user);
    },
  ),
);

app.use(authRouter);

mongoose
  .connect(
    `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URI}/${process.env.MONGODB_DATABASE}?authSource=admin`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions,
  )
  .then(() => console.log(`MongoDB connected successfully 😎`))
  .catch((err) => console.log(`MongoDB connection error: ${err}`));

app.listen(port, () => {
  console.log(`Auth service listening on port ${port} 🚀`);
});
