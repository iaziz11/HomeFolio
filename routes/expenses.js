const express = require('express');
const router = express.Router();
const expenses = require('../controllers/expenses');
const { isLoggedIn } = require('../utils/utils')

router.route('/')
    .get(isLoggedIn, expenses.getExpenses)
    .post(isLoggedIn, expenses.addExpense)

router.route('/:id')
    .get(isLoggedIn, expenses.getExpense)
    .put(isLoggedIn, expenses.editExpense)
    .delete(isLoggedIn, expenses.deleteExpense)

module.exports = router;