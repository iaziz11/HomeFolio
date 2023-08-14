const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be logged in to do that!');
    return res.redirect('/login');
  }
  next();
}

router.get('/login', (req, res) => {
  res.send('GET /login')
})
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/reminders' }));
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`${username}: ${password}`)
    const newUser = new User({ username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, err => {
      if (err) {
        return next(err);
      }
      res.redirect('/reminders');
    })
  } catch (e) {
    res.send(e);
  }
})
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/login')
  });
})

module.exports = router;
