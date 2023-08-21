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
        icon: Joi.string().required().escapeHTML()
    }).required()
})

module.exports.reminderSchema = Joi.object({
    reminder: Joi.object({
        text: Joi.string().required().escapeHTML(),
        nextDate: Joi.string().required().escapeHTML(),
        recurring: Joi.boolean().required(),
        every: Joi.array()
    }).required()
})

module.exports.fileSchema = Joi.object({
    file: Joi.object({
        description: Joi.string().required().escapeHTML()
    }).required(),
    uploadFile: Joi.string().escapeHTML(),
    isExpense: Joi.string().escapeHTML()
})

module.exports.expenseSchema = Joi.object({
    expense: Joi.object({
        value: Joi.string().required().escapeHTML()
    }).required()
})