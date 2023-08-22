const express = require('express');
const router = express.Router();
const passport = require('passport');
const users = require('../controllers/users');
const { isLoggedIn, isNotLoggedIn } = require('../utils/utils')

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/login', (req, res) => {
  res.render('users/login')
})
router.post('/login', isNotLoggedIn, passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/items' }));
router.post('/register', isNotLoggedIn, users.registerUser)
router.post('/logout', isLoggedIn, users.logoutUser)

module.exports = router;
