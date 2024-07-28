const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.NODE_ENV === 'production'
    ? 'https://wanderlust-tmdi.onrender.com/users/auth/google/callback'
    : 'http://localhost:8080/users/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let existingUser = await User.findOne({ googleId: profile.id });

    if (!existingUser) {
      existingUser = await User.findOne({ email: profile.emails[0].value });

      if (existingUser) {
        return done(null, false, { message: 'A user with this email already exists.' });
      }

      const newUser = await new User({
        googleId: profile.id,
        username: profile.displayName,
        email: profile.emails[0].value
      }).save();

      return done(null, newUser);
    }

    done(null, existingUser);
  } catch (err) {
    done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
