const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const mongoConnect = require('./config/mongo');
const {mysqlConnect} = require('./config/db');

const app = express();
const port = process.env.PORT || 4000;

const userRoutes = require('./routes/userRoute');

app.use(bodyParser.json());
app.use(cors());

mongoConnect();
mysqlConnect();

app.use('/api/user', userRoutes);

app.listen(port, () => {
    console.log('Server started on port', port);
})