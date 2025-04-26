const express = require('express')
const passport = require('../services/passport')
const router = express.Router()
const { StatusCodes } = require('http-status-codes')

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.log(err)
      return next(err)
    }
    if (!user)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: info.message })
    req.logIn(user, (err) => {
      if (err) {
        console.log(err)
        return next(err)
      }
      return res.status(StatusCodes.OK).json({ message: 'Успешный вход', user })
    })
  })(req, res, next)
})

router.get('/user_role', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      session: req.isAuthenticated(),
      roleName: req.user.roleName,
    })
  } else {
    return res.json({
      session: req.isAuthenticated(),
    })
  }
})

router.get('/user_fullname', (req, res) => {
  if (req.isAuthenticated()) {
    const fullname =
      req.user.lastName + ' ' + 
      req.user.firstName + ' ' + 
      req.user.thirdName

    return res.json({ fullname })
  }
  return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Недоступно" })
})

router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err)
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: Internal })
    }
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Успешный вход' })
  })
})

module.exports = router
