require('dotenv').config();
const express = require('express');
const configViewEngine = require('./config/viewEngine');
const route = require('./routes/web');
const initAPIRoute = require('./routes/API')

const connection = require('./config/database');

const app = express()
const port = process.env.PORT || 2302;
const hostname = process.env.HOST_NAME || 'localhost';

configViewEngine(app);
initAPIRoute(app);
//config req.body
app.use(express.json()) //for json
app.use(express.urlencoded({ extended: true })) //for form data

app.use('/', route)
app.listen(port, hostname, () => {
    console.log(`server running on {`, hostname, ',', port, '}');
})