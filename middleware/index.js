const createError = require('http-errors');
const { itemSchema, reminderSchema, expenseSchema, fileSchema, userSchema } = require('../joi/schemas')

module.exports.validateItem = (req, res, next) => {
    const { error } = itemSchema.validate(req.body)
    if (error) {
        console.error(error)
        const msg = error.details.map(e => e.message).join(',')
        next(createError(msg));
    } else {
        next();
    }
}

module.exports.validateReminder = (req, res, next) => {
    console.log(req.body)
    const { error } = reminderSchema.validate(req.body)
    if (error) {
        console.error(error)
        const msg = error.details.map(e => e.message).join(',')
        next(createError(msg));
    } else {
        next();
    }
}

module.exports.validateExpense = (req, res, next) => {
    const { error } = expenseSchema.validate(req.body)
    if (error) {
        console.error(error)
        const msg = error.details.map(e => e.message).join(',')
        next(createError(msg));
    } else {
        next();
    }
}

module.exports.validateFile = (req, res, next) => {
    console.log(req.body)
    const { error } = fileSchema.validate(req.body)
    if (error) {
        console.error(error)
        const msg = error.details.map(e => e.message).join(',')
        next(createError(msg));
    } else {
        next();
    }
}

module.exports.validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body)
    if (error) {
        console.error(error)
        const msg = error.details.map(e => e.message).join(',')
        next(createError(msg));
    } else {
        next();
    }
}

module.exports.wrapAsync = func => {
    return (req, res, next) => {
        func(req, res, next).catch(e => {
            console.error(e)
            next(e)
        }
        );
    }
}