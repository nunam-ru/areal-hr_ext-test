const Joi = require('joi')

const organizationSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'any.required': 'Название обязательно',
    'string.base': 'Название должно быть строкой',
    'string.empty': 'Название не может быть пустым',
    'string.min': 'Название: не менее 2 символов',
    'string.max': 'Название: не более 50 символов',
  }),
  comment: Joi.string().max(250).required().messages({
    'any.required': 'Комментарий обязателен',
    'string.base': 'Комментарий должен быть строкой',
    'string.empty': 'Комментарий не может быть пустым',
    'string.max': 'Комментарий: не более 250 символов',
  }),
})

module.exports = organizationSchema
