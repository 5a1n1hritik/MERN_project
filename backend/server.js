const express = require('express');
const dotenv = require('dotenv');
const connectDatabase = require('./database');
const cookieParser = require('cookie-parser');

const app = require('./app');
app.use(cookieParser());

dotenv.config({path:'backend/config/config.env'});
connectDatabase();

app.use(express.json());

app.use('/api',require('./routes/productRoute'));
app.use('/api/product/new',require('./routes/productRoute'));
app.use('/api', require('./routes/productRoute'));
app.use('/api/product', require('./routes/productRoute'));

app.use('/api', require('./routes/userRoute'));
app.use('/api', require('./routes/userRoute'));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

