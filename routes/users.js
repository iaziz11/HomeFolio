const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const users = require('../controllers/users');
const { isLoggedIn, isNotLoggedIn } = require('../utils/utils')


router.get('/login', (req, res) => {
  res.send('GET /login')
})
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/reminders' }));
router.post('/register', users.registerUser)
router.post('/logout', users.logoutUser)

module.exports = router;
