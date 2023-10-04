const express = require("express");
const router = express.Router({ mergeParams: true });
const allExpenses = require("../controllers/allexpenses");
const { isLoggedIn } = require("../utils");
const { wrapAsync } = require("../middleware");

router.route("/").get(isLoggedIn, wrapAsync(allExpenses.getAllExpenses));

router
  .route("/updateRange")
  .get(isLoggedIn, wrapAsync(allExpenses.updateExpenseRange));

module.exports = router;
