const express = require('express');
const router = express.Router({ mergeParams: true });
const reminders = require('../controllers/reminders');
const { isLoggedIn } = require('../utils/utils');
const { validateReminder } = require('../middleware/validateInputs');


router.route('/')
    .get(isLoggedIn, reminders.getReminders)
    .post(isLoggedIn, validateReminder, reminders.addReminder)

router.route('/:id')
    .get(isLoggedIn, reminders.getReminder)
    .put(isLoggedIn, validateReminder, reminders.editReminder)
    .delete(isLoggedIn, reminders.deleteReminder)

module.exports = router;