const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const argon2 = require('argon2')
const {
  getUserByLogin,
  getUserById,
} = require('../controllers/authController')

passport.use(
  new LocalStrategy(
    {
      usernameField: 'login',
      passwordField: 'password',
    },
    async (login, password, done) => {
      try {
        const user = await getUserByLogin(login)

        if (!user)
          return done(null, false, {
            message: 'Неверный логин или пароль',
          })

        const isValidPassword = await argon2.verify(user.password, password)
        if (!isValidPassword)
          return done(null, false, {
            message: 'Неверный логин или пароль',
          })
        return done(null, {
          id: user.id,
          lastName: user.last_name,
          firstName: user.first_name,
          thirdName: user.third_name,
          roleName: user.role_name,
        })
      } catch (err) {
        console.log(err)
        return done(err)
      }
    },
  ),
)

passport.serializeUser((user, done) => {
  done(null, { id: user.id, roleName: user.roleName })
})

passport.deserializeUser(async (userData, done) => {
  try {
    const user = await getUserById(userData.id)

    if (!user) {
      return done(new Error(`${deserialize} ${userData.id}`))
    }

    done(null, {
      id: user.id,
      lastName: user.last_name,
      firstName: user.first_name,
      thirdName: user.third_name,
      roleName: user.role_name,
    })
  } catch (err) {
    console.log(err)
    done(err)
  }
})

module.exports = passport
