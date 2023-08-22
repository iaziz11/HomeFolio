const express = require('express');
const router = express.Router({ mergeParams: true });
const expenses = require('../controllers/expenses');
const { isLoggedIn } = require('../utils');
const { validateExpense } = require('../middleware');

router.route('/')
    .get(isLoggedIn, expenses.getExpenses)
    .post(isLoggedIn, validateExpense, expenses.addExpense)

router.route('/:id')
    .get(isLoggedIn, expenses.getExpense)
    .put(isLoggedIn, validateExpense, expenses.editExpense)
    .delete(isLoggedIn, expenses.deleteExpense)

module.exports = router;