require('dotenv').config({ path: '../../.env' })
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session')

const employees_router = require('./router/employees_router')
const departments_router = require('./router/departments_router')
const organizations_router = require('./router/organizations_router')
const positions_router = require('./router/positions_router')
const users_router = require('./router/users_router')

const app = express();
const port = process.env.API_PORT;

app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true,
  }),
)
app.use(express.json())

app.use('/api', employees_router)
app.use('/api', departments_router)
app.use('/api', organizations_router)
app.use('/api', positions_router)
app.use('/api', users_router)

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})


