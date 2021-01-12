const express = require('express');
const mongoose = require('mongoose');

const app = express();

//ROUTEs
const authRoute = require('./Routes/authentication');

//Route Middlewares
app.use('/api/user', authRoute);

app.listen(3000);