const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');
const GitIntegration = require('../models/GitIntegration');

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_REDIRECT_URI,
            passReqToCallback: true
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                // Parse state if present
                let state = {};
                if (req.query.state) {
                    try {
                        state = JSON.parse(Buffer.from(req.query.state, 'base64').toString());
                    } catch (e) {
                        console.error('Error parsing passport state:', e);
                    }
                }

                const { id, displayName, emails, photos } = profile;
                const email = emails && emails[0] ? emails[0].value : `${id}@github.com`;
                const name = displayName || profile.username;
                const avatar = photos && photos[0] ? photos[0].value : '';

                let user;

                // Handle linking for already logged-in user
                if (state.action === 'link' && state.token) {
                    try {
                        const decoded = require('jsonwebtoken').verify(state.token, process.env.JWT_SECRET);
                        user = await User.findById(decoded.id);
                        if (user) {
                            user.githubId = id;
                            if (avatar && !user.avatar) user.avatar = avatar;
                            await user.save();

                            // Save GitIntegration for future API calls
                            await GitIntegration.findOneAndUpdate(
                                { userId: user._id },
                                {
                                    githubUsername: profile.username,
                                    githubId: id,
                                    avatarUrl: avatar,
                                    accessToken: accessToken,
                                    connectedAt: new Date()
                                },
                                { upsert: true, new: true }
                            );

                            return done(null, user);
                        }
                    } catch (err) {
                        console.error('JWT verification failed in passport link:', err);
                    }
                }

                // Normal login/signup logic
                user = await User.findOne({
                    $or: [
                        { email: email },
                        { githubId: id }
                    ]
                });

                if (user) {
                    if (!user.githubId) {
                        user.githubId = id;
                        await user.save();
                    }
                } else {
                    const randomPassword = require('crypto').randomBytes(16).toString('hex');
                    user = await User.create({
                        name,
                        email,
                        githubId: id,
                        avatar,
                        password: randomPassword,
                        role: 'student'
                    });
                }

                // Always update GitIntegration for API access
                await GitIntegration.findOneAndUpdate(
                    { userId: user._id },
                    {
                        githubUsername: profile.username,
                        githubId: id,
                        avatarUrl: avatar,
                        accessToken: accessToken,
                        connectedAt: new Date()
                    },
                    { upsert: true }
                );

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

// We're using JWT for session management, so we don't strictly need serialize/deserialize
// but passport expects them if using sessions. Since we're using JWT, we'll keep it minimal.
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

module.exports = passport;
