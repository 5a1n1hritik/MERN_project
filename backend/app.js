const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
app.use(express.json());


const productRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute');

app.use('/api/v1', productRoute);
app.use('/api', userRoute);

module.exports = app;
