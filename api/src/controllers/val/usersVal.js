const Joi = require('joi')

const UsersSchema = Joi.object({
  last_name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .regex(/^[^\d]*$/)
    .messages({
        'any.required': 'Фамилия обязательно',
        'string.pattern.base': 'Фамилия не может содержать цифры',
        'string.empty': 'Фамилия не может быть пустым',
        'string.min': 'Фамилия: не менее 2 символов',
        'string.max': 'Фамилия: не более 100 символов',
    }),
  first_name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .regex(/^[^\d]*$/)
    .messages({
        'any.required': 'Имя обязательно',
        'string.pattern.base': 'Имя не может содержать цифры',
        'string.empty': 'Имя не может быть пустым',
        'string.min': 'Имя: не менее 2 символов',
        'string.max': 'Имя: не более 100 символов',
    }),
  third_name: Joi.string()
    .min(2)
    .max(100)
    .regex(/^[^\d]*$/)
    .allow(null, '')
    .messages({
        'string.pattern.base': 'Отчество не может содержать цифры',
        'string.min': 'Отчество: не менее 2 символов',
        'string.max': 'Отчество: не более 100 символов',
    }),
  login: Joi.string()
    .pattern(/^[a-zA-Z0-9]+$/)
    .min(2)
    .max(30)
    .required()
    .messages({
        'string.empty': 'Логин не может быть пустым',
        'string.pattern.base': 'Логин: только цифры и буквы',
        'string.min': 'Логин: не менее 2 символов',
        'string.max': 'Логин: не более 30 символов',
        'any.required': 'Логин обязателен',
    }),
  password: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-!@$%?&*])[A-Za-z\d\-!@$%?&*]{8,64}$/,
    )
    .required()
    .messages({
      'string.empty': 'Пароль не может быть пустым',
      'string.pattern.base':
        'Пароль: минимум 8 символов, включая заглавные буквы, цифры и символы -!@$%?&*',
      'any.required': 'Пароль обязателен',
    }),
})

const UsersSchemaNoPwd = Joi.object({
  last_name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .regex(/^[^\d]*$/)
    .messages({
        'any.required': 'Фамилия обязательно',
        'string.pattern.base': 'Фамилия не может содержать цифры',
        'string.empty': 'Фамилия не может быть пустым',
        'string.min': 'Фамилия: не менее 2 символов',
        'string.max': 'Фамилия: не более 100 символов',
    }),
  first_name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .regex(/^[^\d]*$/)
    .messages({
        'any.required': 'Имя обязательно',
        'string.pattern.base': 'Имя не может содержать цифры',
        'string.empty': 'Имя не может быть пустым',
        'string.min': 'Имя: не менее 2 символов',
        'string.max': 'Имя: не более 100 символов',
    }),
  third_name: Joi.string()
    .min(2)
    .max(100)
    .regex(/^[^\d]*$/)
    .allow(null, '')
    .messages({
        'string.pattern.base': 'Отчество не может содержать цифры',
        'string.min': 'Отчество: не менее 2 символов',
        'string.max': 'Отчество: не более 100 символов',
    }),
  login: Joi.string()
    .pattern(/^[a-zA-Z0-9]+$/)
    .min(2)
    .max(30)
    .required()
    .messages({
        'string.empty': 'Логин не может быть пустым',
        'string.pattern.base': 'Логин: только цифры и буквы',
        'string.min': 'Логин: не менее 2 символов',
        'string.max': 'Логин: не более 30 символов',
        'any.required': 'Логин обязателен',
    }),
})

module.exports = {
  UsersSchema,
  UsersSchemaNoPwd,
}
