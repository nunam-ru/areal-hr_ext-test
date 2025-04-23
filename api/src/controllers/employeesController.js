const pool = require('../services/db')
const { addChangelog, compileChangelog } = require('./changelogController')
const objectID = 4 //id employees = 4

function nullToEmpty(value) {
  if (value === null || value === undefined) {
    return ''
  }
  return value
}

async function getEmployees(
  page = 1, 
  sort_type = 'id',
  order_by = 'asc') {
  const connection = await pool.connect()
  try {
    if (!parseInt(page)) {
      page = 1
    }
    await connection.query('BEGIN')
    const result = await connection.query(
      `SELECT e.id, \
        e.last_name, \
        e.first_name, \
        e.third_name, \
        TO_CHAR(e.birth_date, 'dd.MM.yyyy') AS birth_date, \
        e.passport_series, \
        e.passport_number, \
        e.passport_code, \
        e.passport_by, \
        TO_CHAR(e.passport_date, 'dd.MM.yyyy') as passport_date, \
        e.address, \
        d.id as department_id, \
        d.name AS department_name, \
        p.id as position_id, \
        p.name AS position_name, \
        hr.salary, \
        hr.deleted_at as fired \
        FROM employees e \
        JOIN hr_operations hr on e.id = hr.emp_id \
        join departments d on hr.dep_id = d.id \
        join positions p on hr.pos_id = p.id \
        ORDER BY ${sort_type} ${order_by} \
        LIMIT 10 OFFSET ($1-1)*10;`,
      [page]
    )
    return result.rows
  } catch (err) {
    console.log(err)
  } finally {
    connection.release()
  }
}

async function countEmpRecords() {
  const connection = await pool.connect()
    try {
      await connection.query('BEGIN')
      const result = await connection.query(
        "SELECT COUNT(id) FROM employees\
         WHERE deleted_at IS NULL",
      )
      return result.rows
    } catch (err) {
      console.log(err)
    } finally {
      connection.release()
    }
}

async function addEmployee(
  req,
  last_name,
  first_name,
  third_name,
  birth_date,
  passport_series,
  passport_number,
  passport_code,
  passport_by,
  passport_date,
  address,
  dep_id,
  pos_id,
  salary,
) {
  const connection = await pool.connect()
  try {
    await connection.query('BEGIN')

    const employeeResult = await connection.query(
      `INSERT INTO employees (last_name, first_name, third_name, \
      birth_date, \
      passport_series, passport_number, passport_code, passport_by, passport_date, \
      address, \
      created_at) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, current_timestamp) RETURNING id`,
      [
        last_name,
        first_name,
        third_name,
        birth_date,
        passport_series,
        passport_number,
        passport_code,
        passport_by,
        passport_date,
        address,
      ],
    )

    const employeeId = employeeResult.rows[0].id

    await connection.query(
      `INSERT INTO hr_operations (emp_id, dep_id, pos_id, salary, created_at) \
        VALUES ($1, $2, $3, $4, current_timestamp)`,
      [employeeId, dep_id, pos_id, salary],
    )

    const department = await connection.query(
      'SELECT name FROM departments WHERE id = $1',
      [dep_id],
    )
    const position = await connection.query(
      'SELECT name FROM positions WHERE id = $1',
      [pos_id],
    )

    const dob_format = birth_date.toISOString().split('T')[0]
    
    const newValue = `Фамилия: ${last_name}\n
    Имя: ${first_name}\n
    Отчество: ${nullToEmpty(third_name)}\n
    Дата рождения: ${dob_format}\n
    Серия: ${passport_series}\n
    Номер паспорта: ${passport_number}\n
    Код подразделения: ${passport_code}\n
    Паспорт выдан: ${passport_by}\n
    Дата выдачи: ${passport_date}\n
    Адрес: ${address}\n
    Отдел: ${department.rows[0].name}\n
    Должность: ${position.rows[0].name}\n
    Зарплата: ${salary}\n
    Статус: Работает`

    changes = { 
      "object" : 'employees', 
      "record" : parseInt(employeeId),
      "oldValue" : '',
      "newValue" : newValue
    }
    await addChangelog(objectID, changes, connection, req)

    await connection.query('COMMIT')
    return employeeId
  } catch (err) {
    console.log(err)
  } finally {
    connection.release()
  }
}

async function updateEmployee(
  req,
  emp_id,
  last_name,
  first_name,
  third_name,
  birth_date,
  passport_series,
  passport_number,
  passport_code,
  passport_by,
  passport_date,
  address,
  dep_id,
  pos_id,
  salary,
) {
  const connection = await pool.connect()
  try {
    await connection.query('BEGIN')

    const oldDataResult = await connection.query(
      "SELECT e.id, \
        e.last_name, \
        e.first_name, \
        e.third_name, \
        TO_CHAR(e.birth_date, 'dd.MM.yyyy') AS birth_date, \
        e.passport_series, \
        e.passport_number, \
        e.passport_code, \
        e.passport_by, \
        TO_CHAR(e.passport_date, 'dd.MM.yyyy') AS passport_date, \
        e.address, \
        d.id as department_id, \
        d.name AS department_name, \
        p.id as position_id, \
        p.name AS position_name, \
        hr.salary, \
        hr.deleted_at as fired \
        FROM employees e \
        JOIN hr_operations hr on e.id = hr.emp_id \
        join departments d on hr.dep_id = d.id \
        join positions p on hr.pos_id = p.id \
      where e.id = $1",
      [emp_id],
    )

    await connection.query(
      `UPDATE employees 
        SET last_name = $1, \
        first_name = $2, \
        third_name = $3, \
        birth_date = $4, \
        passport_series = $5, \
        passport_number = $6, \
        passport_code = $7, \
        passport_by = $8, \
        passport_date = $9, \
        address = $10 \
        WHERE id = $11`,
      [
        last_name,
        first_name,
        third_name,
        birth_date,
        passport_series,
        passport_number,
        passport_code,
        passport_by,
        passport_date,
        address,
        emp_id,
      ],
    )

    await connection.query(
      `UPDATE hr_operations 
        SET dep_id = $1, 
        pos_id = $2, 
        salary = $3,
        updated_at = current_timestamp 
        WHERE emp_id = $4`,
      [dep_id, pos_id, salary, emp_id],
    )

    const department = await connection.query(
      'SELECT name FROM departments where id = $1',
      [dep_id],
    )
    const position = await connection.query(
      'SELECT name FROM positions WHERE id = $1',
      [pos_id],
    )

    //const dob_format = birth_date.toISOString().split('T')[0]
    const dob_format = birth_date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    //const passport_date_format = passport_date.toISOString().split('T')[0]
    const passport_date_format = passport_date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })

    let oldValue = ''
    let newValue = ''
    let changelogData = {oldValue, newValue}
    let dep_name = department.rows[0].name
    let pos_name = position.rows[0].name
    let newData = {
      last_name, 
      first_name, 
      third_name, 
      dob_format, 
      passport_series, 
      passport_number, 
      passport_code, 
      passport_by, 
      passport_date_format, 
      dep_name, 
      pos_name,
      salary
    }

    changelogData = await compileEmpChangelog(oldDataResult, newData, changelogData)

    changes = { 
      "object" : 'employees', 
      "record" : parseInt(emp_id),
      "oldValue" : changelogData.oldValue,
      "newValue" : changelogData.newValue
    }
    await addChangelog(objectID, changes, connection, req)

    await connection.query('COMMIT')
    return 'Employee data successfully updated'
  } catch (err) {
    console.log(err)
  } finally {
    connection.release()
  }
}

async function deleteEmployee(req, id) {
  const connection = await pool.connect()
  try {
    await connection.query('BEGIN')

    const oldDataResult = await connection.query(
      'SELECT deleted_at as fired FROM hr_operations where emp_id = $1',
      [id],
    )

    await connection.query(
      `UPDATE hr_operations
        SET deleted_at = current_timestamp
        WHERE emp_id = $1`,
      [id],
    )

    const fired = oldDataResult.rows[0].fired ? 'Уволен' : 'Работает'
    const oldValue = `Статус: ${fired}`
    const newValue = `Статус: Уволен`

    changes = { 
      "object" : 'employees', 
      "record" : parseInt(id),
      "oldValue" : oldValue,
      "newValue" : newValue
    }
    await addChangelog(objectID, changes, connection, req)

    await connection.query('COMMIT')
    return 'Employee terminated successfully'
  } catch (err) {
    await connection.query('ROLLBACK')
    console.log(err)
  } finally {
    connection.release()
  }
}

async function compileEmpChangelog(oldDataResult, newData, changelogData) {
  try {
    if (oldDataResult.rows[0].last_name != newData.last_name) {
      changelogData.oldValue += `Фамилия: ${oldDataResult.rows[0].last_name}\n`
      changelogData.newValue += `Фамилия: ${newData.last_name}\n`
    }
    if (oldDataResult.rows[0].first_name != newData.first_name) {
      changelogData.oldValue += `Имя: ${oldDataResult.rows[0].first_name}\n`
      changelogData.newValue += `Имя: ${newData.first_name}\n`
    }
    if (oldDataResult.rows[0].third_name != newData.third_name) {
      changelogData.oldValue += `Отчество: ${oldDataResult.rows[0].third_name}\n`
      changelogData.newValue += `Отчество: ${newData.third_name}\n`
    }
    if (oldDataResult.rows[0].birth_date != newData.dob_format) {
      changelogData.oldValue += `Дата рождения: ${oldDataResult.rows[0].birth_date}\n`
      changelogData.newValue += `Дата рождения: ${newData.dob_format}\n`
    }
    if (oldDataResult.rows[0].passport_series != newData.passport_series) {
      changelogData.oldValue += `Серия: ${oldDataResult.rows[0].passport_series}\n`
      changelogData.newValue += `Серия: ${newData.passport_series}\n`
    }
    if (oldDataResult.rows[0].passport_number != newData.passport_number) {
      changelogData.oldValue += `Номер паспорта: ${oldDataResult.rows[0].passport_number}\n`
      changelogData.newValue += `Номер паспорта: ${newData.passport_number}\n`
    }
    if (oldDataResult.rows[0].passport_code != newData.passport_code) {
      changelogData.oldValue += `Код подразделения: ${oldDataResult.rows[0].passport_code}\n`
      changelogData.newValue += `Код подразделения: ${newData.passport_code}\n`
    }
    if (oldDataResult.rows[0].passport_by != newData.passport_by) {
      changelogData.oldValue += `Кем выдан: ${oldDataResult.rows[0].passport_by}\n`
      changelogData.newValue += `Кем выдан: ${newData.passport_by}\n`
    }
    if (oldDataResult.rows[0].passport_date != newData.passport_date_format) {
      changelogData.oldValue += `Дата выдачи: ${oldDataResult.rows[0].passport_date}\n`
      changelogData.newValue += `Дата выдачи: ${newData.passport_date_format}\n`
    }
    if (oldDataResult.rows[0].department_name != newData.dep_name) {
      changelogData.oldValue += `Отдел: ${oldDataResult.rows[0].department_name}\n`
      changelogData.newValue += `Отдел: ${newData.dep_name}\n`
    }
    if (oldDataResult.rows[0].position_name != newData.pos_name) {
      changelogData.oldValue += `Должность: ${oldDataResult.rows[0].position_name}\n`
      changelogData.newValue += `Должность: ${newData.pos_name}\n`
    }
    if (oldDataResult.rows[0].salary != newData.salary) {
      changelogData.oldValue += `Зарплата: ${oldDataResult.rows[0].salary}\n`
      changelogData.newValue += `Зарплата: ${newData.salary}\n`
    }
    return changelogData
  }
  catch(err) {
    console.log(err)
  }
}

module.exports = {
    getEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    countEmpRecords,
  }