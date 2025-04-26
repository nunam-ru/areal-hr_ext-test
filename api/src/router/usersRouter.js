const express = require('express')
const router = express.Router()
const pool = require('../services/db')
const { StatusCodes } = require('http-status-codes')
const objectID = 5 //id users = 5

const {
  getUsers,
  addUser,
  updateUser,
  deletedUser,
  updateRole,
  countUsrRecords,
} = require('../controllers/usersController')

const { getChangelog, } = require('../controllers/changelogController')
const { 
  UsersSchema, 
  UsersSchemaNoPwd,
} = require('../controllers/val/usersVal')


router.get('/users', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const { 
        page = 1, 
        sort_type = 'id',
        order_by = 'asc'  } = req.query;
      if (req.user.roleName === 'Администратор') {
        const users = await getUsers(page, sort_type, order_by)
        return res.json(users)
      }
      else {
        return {}
      }
    } catch (err) {
      console.error('Error users:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Недоступно" })
})

router.get('/users/pages', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      if (req.user.roleName === 'Администратор') {
        const pages = await countUsrRecords()
        return res.json(pages)
      }
      else {
        return {}
      }
    } catch (err) {
      console.error('Error users:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Недоступно" })
})

router.get('/users/changelog/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      if (req.user.roleName === 'Администратор') {
        const { id } = req.params
        const usrChangelog = await getChangelog(objectID, id)
        return res.json(usrChangelog)
      }
      else {
        return {}
      }
    } catch (err) {
        console.error('Error users:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Недоступно" })
})

router.post('/users', async (req, res) => {
  if (req.isAuthenticated() && req.user.roleName === 'Администратор') {
    try {
      const { error, value } = UsersSchema.validate(req.body, {
        abortEarly: false,
      })
      if (error) {
        const errorMessages = error.details.reduce((acc, detail) => {
          acc[detail.path[0]] = detail.message
          return acc
        }, {})
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ errors: errorMessages })
      }
      const { last_name, first_name, third_name, login, password } = value
      const newUser = await addUser(
        req,
        last_name,
        first_name,
        third_name,
        login,
        password,
      )
      return res.status(StatusCodes.CREATED).json(newUser)
    } catch (err) {
      console.error('Error users:', err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: Internal })
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Недоступно" })
})

router.put('/users/:id', async (req, res) => {
  if (req.isAuthenticated() && req.user.roleName === 'Администратор') {
    try {
      const isResetPassword = req.query.isResetPassword
      let validationSchema = UsersSchema
      if (isResetPassword == 'false') {
        validationSchema = UsersSchemaNoPwd
      }

      const { error, value } = validationSchema.validate(req.body, {
        abortEarly: false,
      })
      if (error) {
        const errorMessages = error.details.reduce((acc, detail) => {
          acc[detail.path[0]] = detail.message
          return acc
        }, {})
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ errors: errorMessages })
      }

      const { id } = req.params
      const { last_name, first_name, third_name, login, password } = value

      const updatedUser = await updateUser(
        req,
        id,
        last_name,
        first_name,
        third_name,
        login,
        password,
        isResetPassword,
      )
      return res.status(StatusCodes.CREATED).json(updatedUser)
    } catch (err) {
      console.error('Error users:', err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: Internal })
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Недоступно" })
})

router.delete('/users/:id', async (req, res) => {
  if (req.isAuthenticated() && req.user.roleName === 'Администратор') {
    const { id } = req.params
    try {
      const deltedUser = await deletedUser(id)
      return res.status(StatusCodes.CREATED).json(deltedUser)
    } catch (err) {
      console.error('Error users:', err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: Internal })
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Недоступно" })
})

router.put('/users/role/:id', async (req, res) => {
  if (req.isAuthenticated() && req.user.roleName === 'Администратор') {
  const { id } = req.params
    try {
      const updateRoleUser = await updateRole(req, id)
      return res.status(StatusCodes.CREATED).json(updateRoleUser)
    } catch (err) {
      console.error('Error users:', err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: Internal })
    }
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Недоступно" })
})

module.exports = router
