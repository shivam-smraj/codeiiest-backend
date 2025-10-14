
const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "http://localhost:5173/login?error=true", 
        successRedirect: "http://localhost:5173/dashboard", 
    })
);

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('http://localhost:5173/');
    });
});

router.get('/current_user', (req, res) => {
    res.send(req.user); 
});

module.exports = router;