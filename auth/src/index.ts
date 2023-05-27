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
import { Strategy as GitHubStrategy } from 'passport-github2';
const app = express();
const port = process.env.PORT || 5555;

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
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        return done(undefined, user);
      }
      // Here we access the email.
      const email =
        profile.emails && profile.emails[0]
          ? profile.emails[0].value
          : undefined;

      if (!user) {
        // If the user doesn't exist, check if they have an existing account with the same email
        user = await User.findOne({ email: email });

        if (user) {
          // If the user exists by email, add the googleId to their account
          user.googleId = profile.id;
          await user.save();
        } else {
          // If the user doesn't exist by either Google ID or email, create a new account
          user = new User({
            googleId: profile.id,
            email: email,
            username: '$no_name',
          });
          await user.save();
        }
      }

      done(undefined, user);
    },
  ),
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: `${process.env.AUTH_URI}/auth/github/callback`,
    },
    //eslint-ignore-next-line
    //@ts-ignore
    async (accessToken, refreshToken, profile, done) => {
      let user = await User.findOne({ githubId: profile.id });

      // Here we access the email.
      const email =
        profile._json && profile._json.email ? profile._json.email : undefined;

      if (!user) {
        // If the user doesn't exist, check if they have an existing account with the same email
        user = await User.findOne({ email: email });

        if (user) {
          // If the user exists by email, add the githubId to their account
          user.githubId = profile.id;
          await user.save();
        } else {
          // If the user doesn't exist by either GitHub ID or email, create a new account
          user = new User({
            githubId: profile.id,
            email: email || profile.username + '@github.com',
            username: '$no_name',
          });
          await user.save();
        }
      }

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
        const user: IUser | null = await User.findOne({
          email: jwt_payload.email,
        });

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
  .connect(`${process.env.MONGO_CONNECTION_STRING}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => console.log(`MongoDB connected successfully 😎`))
  .catch((err) => console.log(`MongoDB connection error: ${err}`));

app.listen(port, () => {
  console.log(`Auth service listening on port ${port} 🚀`);
});
