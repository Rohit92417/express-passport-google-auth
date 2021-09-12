
const passport = require("passport");
const googleStrategy = require("passport-google-oauth2")
const express = require("express");

const dotenv =  require("dotenv").config();

const app = express();

app.set("view engine","ejs")

app.listen(5000, () => {
    console.log('server is started');
})

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});


passport.use(new googleStrategy({
    clientID: process.env.CLIENT_KEY,
    clientSecret: process.env.SECRET_KEY,
    callbackURL: 'http://localhost:5000/auth/google/callback',
    passReqToCallback   : true,
    profileFields   : ['name','email']
},
function(request, accessToken, refreshToken, profile, done) {
   
    console.log(profile)
    return done(null,profile)
  }
));

app.get("/",(req,res) => {
    res.render("index")    
}
app.get('/auth/google', passport.authenticate('google', { scope: ['email','profile'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/auth/fail' }),
    (req, res, next) => {
        console.log(req.user, req.isAuthenticated());
        res.send('user is logged in');
    })

app.get('/auth/fail', (req, res, next) => {
    res.send('user logged in failed');
});

app.get('/logout', (req, res, next) => {
    req.logout();
    res.send('user is logged out');
});

