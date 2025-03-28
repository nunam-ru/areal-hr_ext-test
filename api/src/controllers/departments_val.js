const Joi = require('joi')

const departmentSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.base': 'Название должно быть строкой',
    'string.empty': 'Название не может быть пустым',
    'string.min': 'Название: минимум 2 символа',
    'string.max': 'Название: не более 50 символов',
    'any.required': 'Название обязательно для заполнения',
  }),
  comment: Joi.string().max(250).required().messages({
    'any.required': 'Комментарий обязателен',
    'string.base': 'Комментарий должен быть строкой',
    'string.empty': 'Комментарий не может быть пустым',
    'string.max': 'Комментарий: не более 250 символов',
  }),
  parent_id: Joi.number().integer().optional().messages({
    'number.base': 'Поле "Родитель" не может быть пустым',
  }),
  org_id: Joi.number().integer().required().messages({
    'number.base': 'Поле "Организация" не может быть пустым',
  }),
})

module.exports = departmentSchema
