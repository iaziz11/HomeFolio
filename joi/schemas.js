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
        date: Joi.string().required().escapeHTML()
    }).required()
})

module.exports.fileSchema = Joi.object({
    file: Joi.object({
        description: Joi.string().required().escapeHTML(),
        expense: Joi.string().required().escapeHTML()
    }).required(),
    uploadFile: Joi.string().escapeHTML()
})

module.exports.expenseSchema = Joi.object({
    expense: Joi.object({
        url: Joi.string().required().escapeHTML(),
        dateAdded: Joi.string().required().escapeHTML(),
        fileName: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
        expense: Joi.string().required().escapeHTML()
    }).required()
})