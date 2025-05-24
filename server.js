const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require("mongoose");
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const resumeRoutes = require('./routes/resumeRoutes');

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const PORT = 3000;

mongoose
  .connect(
    "mongodb+srv://rohitrroffice:XM51Ws1vuXgwNbpp@cluster0.lmdglpv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("DB connected"))
  .catch((error) => console.log(error, "Error"));

const app = express();
app.use(cors({
  origin: 'http://localhost:5174', 
  credentials: true               
}));
app.use(express.json());



app.use(session({
     name: 'res.sid',
  secret: 'secret123',
  resave: false,
  saveUninitialized: false, 
  cookie: {
    httpOnly: true,
    secure: false, 
    maxAge: 24 * 60 * 60 * 1000
  }
}));


app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback'

},


(accessToken, refreshToken, profile, done) => {
  console.log('Google Profile:', profile);
  return done(null, profile);
}));



app.get('/', (req, res) => {
  res.send('<h1>Welcome</h1><a href="/auth/google">Login with Google</a>');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    req.session.loginId = uuidv4();

    console.log('Login ID:', req.session.loginId);

    res.redirect('http://localhost:5174'); 
  }
);

app.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('res.sid');
      res.status(200).send('Logged out');
    });
  });
});

app.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    const { displayName, emails, photos } = req.user;
    res.json({ 
      displayName, 
      email: emails[0].value, 
      photo: photos[0].value,
      loginId: req.session.loginId 
    });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});


app.use('/api', resumeRoutes);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});