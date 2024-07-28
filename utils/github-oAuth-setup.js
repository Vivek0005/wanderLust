const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/user');

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID, 
    clientSecret: process.env.GITHUB_CLIENT_SECRET, 
    callbackURL: process.env.NODE_ENV === 'production'
        ? 'https://wanderlust-tmdi.onrender.com/users/auth/github/callback'
        : 'http://localhost:8080/users/auth/github/callback'
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            let existingUser = await User.findOne({ githubId: profile.id });

            if (!existingUser) {
                let user = new User({
                    githubId: profile.id,
                    username: profile.username,
                    // email: profile.emails[0].value
                });

                await user.save();
                return done(null, user);
            }

            return done(null, existingUser);
        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});
