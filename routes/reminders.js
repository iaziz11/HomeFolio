const express = require('express');
const router = express.Router({ mergeParams: true });
const reminders = require('../controllers/reminders');
const { isLoggedIn } = require('../utils');
const { validateReminder } = require('../middleware');


router.route('/')
    .get(isLoggedIn, reminders.getReminders)
    .post(isLoggedIn, validateReminder, reminders.addReminder)

router.route('/:id')
    .get(isLoggedIn, reminders.getReminder)
    .put(isLoggedIn, reminders.editReminder)
    .delete(isLoggedIn, reminders.deleteReminder)

router.route('/:id/toggleCompleted')
    .put(isLoggedIn, reminders.toggleCompleted)


module.exports = router;