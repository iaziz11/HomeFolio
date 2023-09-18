const express = require("express");
const router = express.Router({ mergeParams: true });
const reminders = require("../controllers/reminders");
const { isLoggedIn, hasPermission } = require("../utils");
const { validateReminder, wrapAsync } = require("../middleware");

router
  .route("/")
  .get(isLoggedIn, hasPermission, wrapAsync(reminders.getReminders))
  .post(
    isLoggedIn,
    hasPermission,
    validateReminder,
    wrapAsync(reminders.addReminder)
  );

router
  .route("/:id")
  .get(isLoggedIn, hasPermission, wrapAsync(reminders.getReminder))
  .put(isLoggedIn, hasPermission, wrapAsync(reminders.editReminder))
  .delete(isLoggedIn, hasPermission, wrapAsync(reminders.deleteReminder));

router
  .route("/:id/toggleCompleted")
  .put(isLoggedIn, hasPermission, wrapAsync(reminders.toggleCompleted));

module.exports = router;
