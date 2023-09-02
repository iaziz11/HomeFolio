const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.itemSchema = Joi.object({
    item: Joi.object({
        name: Joi.string().required().escapeHTML(),
        color: Joi.string().required().escapeHTML()
    }).required(),
    uploadFile: Joi.string().escapeHTML(),
})

module.exports.reminderSchema = Joi.object({
    reminder: Joi.object({
        text: Joi.string().required().escapeHTML(),
        nextDate: Joi.string().required().escapeHTML(),
        recurring: Joi.string().allow(''),
        every: Joi.string().escapeHTML()
    }).required()
})

module.exports.fileSchema = Joi.object({
    file: Joi.object({
        name: Joi.string().required().escapeHTML()
    }).required(),
    uploadFile: Joi.string().escapeHTML(),
    isExpense: Joi.string().escapeHTML()
})

module.exports.expenseSchema = Joi.object({
    expense: Joi.object({
        value: Joi.number().required(),
        date: Joi.string().required().escapeHTML(),
        name: Joi.string().required().escapeHTML()
    }).required()
})

module.exports.userSchema = Joi.object({
    fullName: Joi.string().required().escapeHTML(),
    username: Joi.string().required().escapeHTML(),
    password: Joi.string().required().escapeHTML()
})
