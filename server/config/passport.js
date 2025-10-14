const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User"); 

module.exports = function (passport) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "/api/auth/google/callback",
            },
            async (accessToken, refreshToken, profile, done) => {
                // 1. Check if the user's email domain is allowed
                const email = profile.emails[0].value;
                if (!email.endsWith("@students.iiests.ac.in")) {
                    // If not the right domain, fail the authentication
                    return done(new Error("Invalid host domain."), null);
                }

                const newUser = {
                    googleId: profile.id,
                    displayName: profile.displayName,
                    email: email,
                    image: profile.photos[0].value,
                };

                try {
                    let user = await User.findOne({ googleId: profile.id });

                    if (user) {
                        done(null, user);
                    } else {
                        user = await User.create(newUser);
                        done(null, user);
                    }
                } catch (err) {
                    console.error(err);
                    done(err, null);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
      try {
        const user = await User.findById(id);
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    });
};