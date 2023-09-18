const express = require("express");
const router = express.Router({ mergeParams: true });
const expenses = require("../controllers/expenses");
const { isLoggedIn, hasPermission } = require("../utils");
const { validateExpense, wrapAsync } = require("../middleware");

router
  .route("/")
  .get(isLoggedIn, hasPermission, wrapAsync(expenses.getExpenses))
  .post(
    isLoggedIn,
    hasPermission,
    validateExpense,
    wrapAsync(expenses.addExpense)
  );

router
  .route("/:id")
  .get(isLoggedIn, hasPermission, wrapAsync(expenses.getExpense))
  .put(
    isLoggedIn,
    hasPermission,
    validateExpense,
    wrapAsync(expenses.editExpense)
  )
  .delete(isLoggedIn, hasPermission, expenses.deleteExpense);

router
  .route("/allexpenses")
  .get(isLoggedIn, wrapAsync(expenses.getAllExpenses));

module.exports = router;
