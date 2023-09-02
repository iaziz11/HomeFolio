const express = require('express');
const router = express.Router({ mergeParams: true });
const expenses = require('../controllers/expenses');
const { isLoggedIn } = require('../utils');
const { validateExpense, wrapAsync } = require('../middleware');

router.route('/')
    .get(isLoggedIn, wrapAsync(expenses.getExpenses))
    .post(isLoggedIn, validateExpense, wrapAsync(expenses.addExpense))

router.route('/:id')
    .get(isLoggedIn, wrapAsync(expenses.getExpense))
    .put(isLoggedIn, validateExpense, wrapAsync(expenses.editExpense))
    .delete(isLoggedIn, expenses.deleteExpense)

router.route('/allexpenses')
    .get(isLoggedIn, wrapAsync(expenses.getAllExpenses))

module.exports = router;