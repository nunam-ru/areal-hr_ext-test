const Joi = require('joi')

const positionSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.base': 'Название должно быть строкой',
    'string.empty': 'Название не может быть пустым',
    'string.min': 'Название: не менее 2 символов',
    'string.max': 'Название: не более 50 символов',
    'any.required': 'Название обязательно для заполнения',
  }),
  dep_id: Joi.number().integer().required().messages({
    'any.required': 'Поле "Отдел" обязательно для заполнения',
    'number.base': 'ID отдела не может быть пустым',
  }),
})

module.exports = positionSchema