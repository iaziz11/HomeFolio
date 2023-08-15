const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const users = require('../controllers/users');
const { isLoggedIn, isNotLoggedIn } = require('../utils/utils')


router.get('/login', isNotLoggedIn, (req, res) => {
  res.send('GET /login')
})
router.post('/login', isNotLoggedIn, passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/reminders' }));
router.post('/register', isNotLoggedIn, users.registerUser)
router.post('/logout', isLoggedIn, users.logoutUser)

module.exports = router;
