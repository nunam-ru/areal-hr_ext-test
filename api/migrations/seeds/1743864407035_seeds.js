exports.up = (pgm) => {

    pgm.sql(`
        INSERT INTO organizations (name, comment, created_at) VALUES
          ('ООО ИТ-Лабс', 'Разработка ПО', current_timestamp),
          ('ОАО Нефть', 'Разработка месторождений', current_timestamp);
      `)

    pgm.sql(`
        INSERT INTO departments (name, parent_id, comment, org_id, created_at) VALUES
        ('HR', null, 'Отдел кадров', 1, current_timestamp),
        ('IT', 1, 'Отдел разработки', 2, current_timestamp);
    `)

    pgm.sql(`
        INSERT INTO positions (name, dep_id, created_at) VALUES
        ('HR-менеджер', 1, current_timestamp),
        ('Тестировщик', 2, current_timestamp);
    `)

    pgm.sql(`
        INSERT INTO employees (last_name, first_name, third_name, birth_date, passport_series, passport_number, passport_code, passport_by, passport_date, address, created_at) VALUES
        ('Иванов', 'Иван', 'Иванович', '2001-01-25', '1234', '567890', '123-456', 'МВД России', '2021-01-28', 'Ленина, 15', current_timestamp),
        ('Петров', 'Петр', 'Петрович', '2002-01-30', '9876', '543210', '654-321', 'УМВД России', '2022-02-24', 'Ленина, 16', current_timestamp);
    `)

    pgm.sql(`
        INSERT INTO roles (name) VALUES
            ('Администратор'),
            ('Сотрудник');
        `)

    pgm.sql(`
        INSERT INTO users (last_name, first_name, third_name, login, password, role_id) VALUES
        ('Иванов', 'Иван', 'Иванович', 'admin', 'admin', 1),
        ('Петров', 'Петр', 'Петрович', 'manager', 'manager', 2);
        `)

};
  
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