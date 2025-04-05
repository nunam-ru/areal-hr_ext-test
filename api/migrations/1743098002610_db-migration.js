exports.up = (pgm) => {

    //организации
    pgm.createTable('organizations', {
        id: 'id',
        name: { type: 'varchar(255)', notNull: true, unique: true },
        comment: { type: 'text' },
        created_at: {type: 'timestamptz'},
        updated_at: {type: 'timestamptz'},
        deleted_at: {type: 'timestamptz'},
    });

    // pgm.sql(`
    //     INSERT INTO organizations (name, comment, created_at) VALUES
    //       ('ООО ИТ-Лабс', 'Разработка ПО', current_timestamp),
    //       ('ОАО Нефть', 'Разработка месторождений', current_timestamp);
    //   `)

    //отделы 
    pgm.createTable('departments', {
        id: 'id',
        org_id: { type: 'integer', notNull: true, references: 'organizations' },
        name: { type: 'varchar(255)', notNull: true },
        parent_id: { type: 'integer', references: 'departments' },
        comment: { type: 'text' },
        created_at: {type: 'timestamptz'},
        updated_at: {type: 'timestamptz'},
        deleted_at: {type: 'timestamptz'},
    });

    // pgm.sql(`
    //     INSERT INTO departments (name, parent_id, comment, org_id, created_at) VALUES
    //     ('HR', null, 'Отдел кадров', 1, current_timestamp),
    //     ('IT', 1, 'Отдел разработки', 2, current_timestamp);
    // `)

    //должности
    pgm.createTable('positions', {
        id: 'id',
        name: { type: 'varchar(255)', notNull: true },
        dep_id: { type: 'integer', notNull: true, references: 'departments' },
        created_at: {type: 'timestamptz'},
        updated_at: {type: 'timestamptz'},
        deleted_at: {type: 'timestamptz'},
    });

    // pgm.sql(`
    //     INSERT INTO positions (name, dep_id, created_at) VALUES
    //     ('HR-менеджер', 1, current_timestamp),
    //     ('Тестировщик', 2, current_timestamp);
    // `)

    //сотрудники
    pgm.createTable('employees', {
        id: 'id',
        last_name: { type: 'varchar(255)', notNull: true },
        first_name: { type: 'varchar(255)', notNull: true },
        third_name: { type: 'varchar(255)' },
        birth_date: { type: 'date', notNull: true },
        address: { type: 'text', notNull: true },
        passport_series: { type: 'varchar(10)', notNull: true },
        passport_number: { type: 'varchar(10)', notNull: true },
        passport_code: { type: 'varchar(10)', notNull: true },
        passport_by: { type: 'varchar(255)', notNull: true },
        passport_date: { type: 'date', notNull: true },
        created_at: {type: 'timestamptz'},
        updated_at: {type: 'timestamptz'},
        deleted_at: {type: 'timestamptz'},
    });

    // pgm.sql(`
    //     INSERT INTO employees (last_name, first_name, third_name, birth_date, passport_series, passport_number, passport_code, passport_by, passport_date, address, created_at) VALUES
    //     ('Иванов', 'Иван', 'Иванович', '2001-01-25', '1234', '567890', '123-456', 'МВД России', '2021-01-28', 'Ленина, 15', current_timestamp),
    //     ('Петров', 'Петр', 'Петрович', '2002-01-30', '9876', '543210', '654-321', 'УМВД России', '2022-02-24', 'Ленина, 16', current_timestamp);
    // `)

    //файлы
    pgm.createTable('files', {
        id: 'id',
        emp_id: { type: 'integer', notNull: true, references: 'employees' },
        name: { type: 'varchar(255)', notNull: true },
        path: { type: 'varchar(255)', notNull: true },
        created_at: {type: 'timestamptz'},
        updated_at: {type: 'timestamptz'},
        deleted_at: {type: 'timestamptz'},
    });

    //операции
    pgm.createTable('hr_operations', {
        id: 'id',
        type: { type: 'varchar(255)'},
        emp_id: { type: 'integer', notNull: true, references: 'employees' },
        dep_id: { type: 'integer', notNull: true, references: 'departments' },
        pos_id: { type: 'integer', notNull: true, references: 'positions' },
        salary: { type: 'numeric(10, 2)' },
        created_at: {type: 'timestamptz'},
        updated_at: {type: 'timestamptz'},
        deleted_at: {type: 'timestamptz'},
    });

    //роли
    pgm.createTable('roles', {
        id: 'id',
        name: { type: 'varchar(255)', notNull: true },
    });

    // pgm.sql(`
    //     INSERT INTO roles (name) VALUES
    //         ('Администратор'),
    //         ('Сотрудник');
    //     `)

    // пользователи
    pgm.createTable('users', {
        id: 'id',
        last_name: { type: 'varchar(255)', notNull: true },
        first_name: { type: 'varchar(255)', notNull: true },
        third_name: { type: 'varchar(255)', notNull: true }, 
        login: { type: 'varchar(255)', notNull: true, unique: true },
        password: { type: 'varchar(255)', notNull: true },
        role_id: { type: 'integer', notNull: true, references: 'roles' },
    });

    // pgm.sql(`
    //     INSERT INTO users (last_name, first_name, third_name, login, password, role_id) VALUES
    //     ('Иванов', 'Иван', 'Иванович', 'admin', 'admin', 1),
    //     ('Петров', 'Петр', 'Петрович', 'manager', 'manager', 2);
    //     `)

    //история
    pgm.createTable('changelog', {
        id: 'id',
        date: { type: 'timestamptz', notNull: true },
        object: { type: 'varchar(255)', notNull: true },
        changes: { type: 'json', notNull: true },
        user_id: { type: 'integer', notNull: true, references: 'users' },
    });

};
  
exports.down = (pgm) => {
    pgm.dropTable('changelog');
    pgm.dropTable('users');
    pgm.dropTable('roles');
    pgm.dropTable('hr_operations');
    pgm.dropTable('files');
    pgm.dropTable('employees');
    pgm.dropTable('positions');
    pgm.dropTable('departments');
    pgm.dropTable('organizations');
};