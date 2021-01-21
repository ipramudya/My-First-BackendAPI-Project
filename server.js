const express = require('express');
const dotenv = require('dotenv');

//Menangkap file routes
const bootcamps = require('./routes/bootcamps');

//Memuat env variables
dotenv.config({ path: './config/config.env' });

//Menjalankan express method
const app = express();

//Memasang routers dan menghubungkan dengan bootcamps route
app.use('/api/v1/bootcamps', bootcamps);

//Menjalankan PORT server
const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
