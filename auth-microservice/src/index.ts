import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import expressSession from 'express-session';
import passport from 'passport';
import cors from 'cors';
import { IUser, User } from '@/models/user';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { authRouter } from '@/routes/auth';

const app = express();
const port = process.env.AUTH_SERVICE_PORT || 5555;

app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    credentials: true,
  }),
);

app.use(
  expressSession({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.AUTH_URI}/auth/google/callback`,
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
        email: email,
        username: 'RuleBreaker',
      });
      await user.save();

      done(undefined, user);
    },
  ),
);

const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};
interface JwtPayload {
  email: string;
  [key: string]: any;
}

passport.use(
  new JwtStrategy(
    opts,
    async (
      jwt_payload: JwtPayload,
      done: (error: any, user?: IUser | false) => void,
    ) => {
      try {
        const user: IUser | null = await User.findOne({ id: jwt_payload.sub });

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
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
