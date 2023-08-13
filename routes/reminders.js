const express = require('express');
const router = express.Router();
const reminders = require('../controllers/reminders')

router.route('/')
    .get(reminders.getReminders)
    .post(reminders.addReminder)

router.route('/:id')
    .get(reminders.getReminder)
    .put(reminders.editReminder)
    .delete(reminders.deleteReminder)

module.exports = router;