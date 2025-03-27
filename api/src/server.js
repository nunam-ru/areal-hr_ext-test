require('dotenv').config({ path: '../.env' })
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.API_PORT;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello World, from express' });
});

app.listen(port, () => {
    console.log(`Hello world app listening on port ${port}!`)
});

