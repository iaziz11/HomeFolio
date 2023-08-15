const express = require('express');
const router = express.Router({ mergeParams: true });
const reminders = require('../controllers/reminders');
const { isLoggedIn } = require('../utils/utils');


router.route('/')
    .get(isLoggedIn, reminders.getReminders)
    .post(isLoggedIn, reminders.addReminder)

router.route('/:id')
    .get(isLoggedIn, reminders.getReminder)
    .put(isLoggedIn, reminders.editReminder)
    .delete(isLoggedIn, reminders.deleteReminder)

module.exports = router;