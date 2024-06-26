const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const mongoConnect = require('./config/mongo');
const {mysqlConnect} = require('./config/db');

const app = express();
const port = process.env.PORT || 4000;

const userRoutes = require('./routes/userRoute');
const sheetRoutes = require('./routes/characterSheetRoute');
const { APIToolkit } = require('apitoolkit-express');

const apitoolkitClient = APIToolkit.NewClient({apiKey : process.env.API_TOOLKIT_API_KEY});

app.use(bodyParser.json());
app.use(cors());

app.use(apitoolkitClient.expressMiddleware);

mongoConnect();
mysqlConnect();

app.use('/api/user', userRoutes);
app.use('/api/joueur', sheetRoutes);
app.use(apitoolkitClient.errorHandler);

app.listen(port, () => {
    console.log('Server started on port', port);
})