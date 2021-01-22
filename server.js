const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');

//Memuat env variables
dotenv.config({ path: './config/config.env' });

//Connect ke MongoDB database
connectDB();

//Menangkap file routes
const bootcamps = require('./routes/bootcamps');

//Menjalankan express method
const app = express();

//Dev Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Memasang routers dan menghubungkan dengan bootcamps route
app.use('/api/v1/bootcamps', bootcamps);

//Menjalankan PORT server
const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);

//Handle promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Rejection, ${err.message}`);

  //Close server
  server.close(() => process.exit(1));
});
