const Joi = require('joi')

const employeeSchema = Joi.object({
    last_name: Joi.string()
        .min(3)
        .max(255)
        .required()
        .regex(/^[^\d]*$/)
        .messages({
        'any.required': 'Поле "Фамилия" обязательно',
        'string.pattern.base': 'Поле "Фамилия" не может содержать цифры',
        'string.empty': 'Поле "Фамилия" не может быть пустым',
        'string.min': '"Фамилия": не менее 3 символов',
        'string.max': '"Фамилия": не более 100 символов',
        }),
    first_name: Joi.string()
        .min(3)
        .max(100)
        .required()
        .regex(/^[^\d]*$/)
        .messages({
        'any.required': 'Поле "Имя" обязательно',
        'string.pattern.base': 'Поле "Имя" не может содержать цифры',
        'string.empty': 'Поле "Имя" не может быть пустым',
        'string.min': '"Имя": не менее 3 символов',
        'string.max': '"Имя": не более 100 символов',
        }),
    third_name: Joi.string()
        .min(3)
        .max(100)
        .regex(/^[^\d]*$/)
        .allow(null, '')
        .messages({
        'string.pattern.base': 'Поле "Отчество" не может содержать цифры',
        'string.min': '"Отчество": не менее 3 символов',
        'string.max': '"Отчество": не более 100 символов',
        }),
    birth_date: Joi.date().required().messages({
        'any.required': 'Поле "Дата рождения" обязательно',
        'date.empty': 'Поле "Дата рождения" не может быть пустым',
    }),
    passport_series: Joi.string()
        .pattern(/^\d{4}$/)
        .required()
        .messages({
        'any.required': 'Поле "Серия паспорта" обязательно',
        'string.empty': 'Поле "Серия паспорта" не может быть пустым',
        'string.pattern.base':
            'Поле "Серия паспорта" должно содержать ровно 4 цифры',
        }),
    passport_number: Joi.string()
        .pattern(/^\d{6}$/)
        .required()
        .messages({
        'any.required': 'Поле "Номер паспорта" обязательно',
        'string.empty': 'Поле "Номер паспорта" не может быть пустым',
        'string.pattern.base':
            'Поле "Номер паспорта" должно содержать ровно 6 цифр',
        }),

    passport_code: Joi.string().pattern(/^\d{3}-\d{3}$/).min(3).max(7).required().messages({
        'any.required': 'Поле "Код подразделения" обязательно для заполнения',
        'string.empty': 'Поле "Код подразделения" не может быть пустым',
        'string.min': '"Код подразделения": не менее 3 символов',
        'string.max': '"Код подразделения": не более 7 символов (123-456)',
    }),
    passport_by: Joi.string().min(3).max(50).required().messages({
        'any.required': 'Поле "Кем выдан" обязательно для заполнения',
        'string.empty': 'Поле "Кем выдан" не может быть пустым',
        'string.min': '"Кем выдан": не менее 3 символов',
        'string.max': '"Кем выдан": не более 50 символов',
    }),
    passport_date: Joi.date().required().messages({
        'any.required': 'Поле "Дата выдачи" обязательно',
        'date.empty': 'Поле "Дата выдачи" не может быть пустым',
    }),
    address: Joi.string().min(3).max(150).required().messages({
        'any.required': 'Поле "Адрес" обязательно для заполнения',
        'string.empty': 'Поле "Адрес" не может быть пустым',
        'string.min': '"Адрес": не менее 3 символов',
        'string.max': '"Адрес": не более 150 символов',
    }),
    dep_id: Joi.number().integer().required().messages({
        'any.required': 'Поле "Отдел" обязательно для заполнения',
        'number.base': 'Поле "Отдел" не может быть пустым',
    }),
    pos_id: Joi.number().integer().required().messages({
        'any.required': 'Поле "Должность" обязательно для заполнения',
        'number.base': 'Поле "Должность" не может быть пустым',
    }),
    salary: Joi.number().precision(2).min(1).required().messages({
        'any.required': 'Поле "Зарплата" обязательно',
        'number.base': 'Поле "Зарплата" должно быть числом',
        'number.precision':
        'Поле "Зарплата" должно иметь не более двух знаков после запятой',
        'number.min': 'Зарплата должна быть больше 0',
    }),
})

module.exports = employeeSchema
