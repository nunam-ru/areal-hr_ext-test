require('dotenv').config({ path: '../../.env' })
const express = require('express')
//const bodyParser = require('body-parser');
//const session = require('express-session')
const cors = require('cors');

const employees_router = require('./router/employeesRouter')
const departments_router = require('./router/departmentsRouter')
const organizations_router = require('./router/organizationsRouter')
const positions_router = require('./router/positionsRouter')
const users_router = require('./router/usersRouter')
const files_router = require('./router/filesRouter')

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
app.use('/api', files_router)

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})


