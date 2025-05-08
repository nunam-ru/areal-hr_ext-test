require('dotenv').config({ path: '../.env' })
const argon2 = require('argon2')

exports.up = async (pgm) => {

    const admin_login = process.env.ADMIN_LOGIN
    const admin_password = await argon2.hash(process.env.ADMIN_PASSWORD, {
    type: argon2.argon2id,
    })
    const manager_login = process.env.MANAGER_LOGIN
    const manager_password = await argon2.hash(process.env.MANAGER_PASSWORD, {
    type: argon2.argon2id,
    })

    pgm.sql(`
        INSERT INTO organizations (id, name, comment, created_at) VALUES
          (1, 'ООО ИТ-Лабс', 'Разработка ПО', current_timestamp),
          (2, 'ОАО Нефть', 'Разработка месторождений', current_timestamp)
          ON CONFLICT (id) DO NOTHING;
      `)

    pgm.sql(`
        SELECT setval('organizations_id_seq', max(id)) FROM organizations;
        `)

    pgm.sql(`
        INSERT INTO departments (id, name, parent_id, comment, org_id, created_at) VALUES
        (1, 'HR', null, 'Отдел кадров', 1, current_timestamp),
        (2, 'IT', 1, 'Отдел разработки', 2, current_timestamp)
        ON CONFLICT (id) DO NOTHING;
    `)

    pgm.sql(`
        SELECT setval('departments_id_seq', max(id)) FROM departments;
        `)

    pgm.sql(`
        INSERT INTO positions (id, name, dep_id, created_at) VALUES
        (1, 'HR-менеджер', 1, current_timestamp),
        (2, 'Тестировщик', 2, current_timestamp)
        ON CONFLICT (id) DO NOTHING;
    `)

    pgm.sql(`
        SELECT setval('positions_id_seq', max(id)) FROM positions;
        `)

    pgm.sql(`
        INSERT INTO employees (id, last_name, first_name, third_name, birth_date, passport_series, passport_number, passport_code, passport_by, passport_date, address, created_at) VALUES
        (1, 'Иванов', 'Иван', 'Иванович', '2001-01-25', '1234', '567890', '123-456', 'МВД России', '2021-01-28', 'Ленина, 15', current_timestamp),
        (2, 'Петров', 'Петр', 'Петрович', '2002-01-30', '9876', '543210', '654-321', 'УМВД России', '2022-02-24', 'Ленина, 16', current_timestamp)
        ON CONFLICT (id) DO NOTHING;
    `)

    pgm.sql(`
        SELECT setval('employees_id_seq', max(id)) FROM employees;
        `)

    pgm.sql(`
        INSERT INTO roles (id, name) VALUES
            (1, 'Администратор'),
            (2, 'Сотрудник')
            ON CONFLICT (id) DO NOTHING;
        `)

    pgm.sql(`
        SELECT setval('roles_id_seq', max(id)) FROM roles;
        `)

    pgm.sql(`
        INSERT INTO users (id, last_name, first_name, third_name, login, password, role_id) VALUES
        (1, 'Иванов', 'Иван', 'Иванович', '${admin_login}', '${admin_password}', 1),
        (2, 'Петров', 'Петр', 'Петрович', '${manager_login}', '${manager_password}', 2)
        ON CONFLICT (id) DO NOTHING;
        `)

    pgm.sql(`
        SELECT setval('users_id_seq', max(id)) FROM users;
        `)

};
  

// admin:
// login: admin
// password: $argon2id$v=19$m=65536,t=3,p=4$8nakMbZasHQCoQxWAqgWnQ$nZHsUn7Hy2oD80sRnYq64XeENH29ZrsPlM6+OFcLtLc

// manager:
// login: manager
// password: $argon2id$v=19$m=65536,t=3,p=4$SroyPcFYHyr1K6ss6Khhjg$+0riDKlVKU1AszYHd6sBwAH2cOJZjqaPTSpbuo6l8Ic

// exports.down = (pgm) => {
//     pgm.dropTable('changelog');
//     pgm.dropTable('users');
//     pgm.dropTable('roles');
//     pgm.dropTable('hr_operations');
//     pgm.dropTable('files');
//     pgm.dropTable('employees');
//     pgm.dropTable('positions');
//     pgm.dropTable('departments');
//     pgm.dropTable('organizations');
// };