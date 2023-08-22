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
        every: Joi.string().escapeHTML()
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

{/* <label for="body">Text</label>
    <input type="text" id="body" name="reminder[text]">
    <label for="nextDate">Start Date</label>
    <input type="datetime-local" id="nextDate" name="reminder[nextDate]">
    <label for="recurring">Is recurring?</label>
    <select name="reminder[recurring]" id="recurring">
      <option value="true" selected>Yes</option>
      <option value="false">No</option>
    </select>
    <label for="every">Every?</label>
    <select name="reminder[every]" id="every">
      <option value="[0 0 0 0 0 1]" selected>Minute</option>
      <option value="[0 0 0 0 0 5]">5 Minutes</option>
      <option value="[0 0 0 0 0 10]">10 Minutes</option>
      <option value="[0 0 0 0 1 0]">Hour</option>
    </select>
    <button>Submit</button>
  </form> */}