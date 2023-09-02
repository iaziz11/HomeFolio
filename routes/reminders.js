const express = require('express');
const router = express.Router({ mergeParams: true });
const reminders = require('../controllers/reminders');
const { isLoggedIn } = require('../utils');
const { validateReminder, wrapAsync } = require('../middleware');


router.route('/')
    .get(isLoggedIn, wrapAsync(reminders.getReminders))
    .post(isLoggedIn, validateReminder, wrapAsync(reminders.addReminder))

router.route('/:id')
    .get(isLoggedIn, wrapAsync(reminders.getReminder))
    .put(isLoggedIn, wrapAsync(reminders.editReminder))
    .delete(isLoggedIn, wrapAsync(reminders.deleteReminder))

router.route('/:id/toggleCompleted')
    .put(isLoggedIn, wrapAsync(reminders.toggleCompleted))


module.exports = router;