// backend/config/passport.js
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
import User from '../models/userModel.js';

const configurePassport = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/api/v1/users/google/callback', 
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const userEmail = profile.emails[0].value;
                    const userDomain = profile._json.hd; // 'hd' is the hosted domain field from Google

                    // 1. Verify if the user belongs to the G Suite organization
                    if (userDomain !== process.env.G_SUITE_DOMAIN) {
                        return done(new Error('Invalid host domain. Please use your institute email.'), null);
                    }

                    // 2. Find user in our database
                    let user = await User.findOne({ email: userEmail });

                    // 3. If user doesn't exist, create a new one (this is the "sign-up" part)
                    if (!user) {
                        user = await User.create({
                            name: profile.displayName,
                            email: userEmail,
                        });
                    }
                    // 4. Pass the user object to the next middleware
                    return done(null, user);

                } catch (error) {
                    return done(error, null);
                }
            }
        )
    );
};

export default configurePassport;