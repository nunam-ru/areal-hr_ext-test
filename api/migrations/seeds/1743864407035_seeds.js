exports.up = (pgm) => {

    pgm.sql(`
        INSERT INTO organizations (id, name, comment, created_at) VALUES
          (1, 'ООО ИТ-Лабс', 'Разработка ПО', current_timestamp),
          (2, 'ОАО Нефть', 'Разработка месторождений', current_timestamp)
          ON CONFLICT (id) DO NOTHING;
      `)

    pgm.sql(`
        INSERT INTO departments (id, name, parent_id, comment, org_id, created_at) VALUES
        (1, 'HR', null, 'Отдел кадров', 1, current_timestamp),
        (2, 'IT', 1, 'Отдел разработки', 2, current_timestamp)
        ON CONFLICT (id) DO NOTHING;
    `)

    pgm.sql(`
        INSERT INTO positions (id, name, dep_id, created_at) VALUES
        (1, 'HR-менеджер', 1, current_timestamp),
        (2, 'Тестировщик', 2, current_timestamp)
        ON CONFLICT (id) DO NOTHING;
    `)

    pgm.sql(`
        INSERT INTO employees (id, last_name, first_name, third_name, birth_date, passport_series, passport_number, passport_code, passport_by, passport_date, address, created_at) VALUES
        (1, 'Иванов', 'Иван', 'Иванович', '2001-01-25', '1234', '567890', '123-456', 'МВД России', '2021-01-28', 'Ленина, 15', current_timestamp),
        (2, 'Петров', 'Петр', 'Петрович', '2002-01-30', '9876', '543210', '654-321', 'УМВД России', '2022-02-24', 'Ленина, 16', current_timestamp)
        ON CONFLICT (id) DO NOTHING;
    `)

    pgm.sql(`
        INSERT INTO roles (id, name) VALUES
            (1, 'Администратор'),
            (2, 'Сотрудник')
            ON CONFLICT (id) DO NOTHING;
        `)

    pgm.sql(`
        INSERT INTO users (id, last_name, first_name, third_name, login, password, role_id) VALUES
        (1, 'Иванов', 'Иван', 'Иванович', 'admin', '$argon2id$v=19$m=65536,t=3,p=4$8nakMbZasHQCoQxWAqgWnQ$nZHsUn7Hy2oD80sRnYq64XeENH29ZrsPlM6+OFcLtLc', 1),
        (2, 'Петров', 'Петр', 'Петрович', 'manager', '$argon2id$v=19$m=65536,t=3,p=4$SroyPcFYHyr1K6ss6Khhjg$+0riDKlVKU1AszYHd6sBwAH2cOJZjqaPTSpbuo6l8Ic', 2)
        ON CONFLICT (id) DO NOTHING;
        `)

};
  

// admin:
// login: admin
// password: Admin111!

// manager:
// login: manager
// password: Manager1!

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