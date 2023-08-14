const express = require('express');
const router = express.Router();
const reminders = require('../controllers/reminders')

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}

router.route('/')
    .get(isLoggedIn, reminders.getReminders)
    .post(isLoggedIn, reminders.addReminder)

router.route('/:id')
    .get(isLoggedIn, reminders.getReminder)
    .put(isLoggedIn, reminders.editReminder)
    .delete(isLoggedIn, reminders.deleteReminder)

module.exports = router;